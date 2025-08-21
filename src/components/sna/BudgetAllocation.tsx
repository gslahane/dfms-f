// src/components/BudgetAllocation.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";

// shadcn/ui combobox primitives (searchable dropdown)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   MOCKS                                    */
/* -------------------------------------------------------------------------- */

type DemandRecord = {
  districtCode: string;
  district: string;
  taluka: string;
  planType: "HADP";
  financialYear: string;
  demandCode: string;
  schemeCode: string;
  schemeName: string;
  head: string;
  demandAmount: number;
  spillAmount: number;
  remainingBalance: number;
  status: "Approved" | "Pending" | "Rejected";
};

export const hadpMock: DemandRecord[] = [
  {
    districtCode: "HADP-AMB",
    district: "Pune",
    taluka: "Ambegaon",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Ambegaon",
    schemeCode: "HADP01",
    schemeName: "HADP Special Scheme",
    head: "—",
    demandAmount: 20000,
    spillAmount: 98.18,
    remainingBalance: 101.82,
    status: "Approved"
  },
  {
    districtCode: "HADP-JUN",
    district: "Pune",
    taluka: "Junnar",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Junnar",
    schemeCode: "HADP02",
    schemeName: "HADP Development Grant",
    head: "—",
    demandAmount: 20000,
    spillAmount: 57.29,
    remainingBalance: 142.71,
    status: "Approved"
  },
  {
    districtCode: "HADP-MAW",
    district: "Pune",
    taluka: "Mawal",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Mawal",
    schemeCode: "HADP03",
    schemeName: "HADP Rural Infrastructure",
    head: "—",
    demandAmount: 20000,
    spillAmount: 114.18,
    remainingBalance: 85.82,
    status: "Approved"
  },
  {
    districtCode: "HADP-BHO",
    district: "Pune",
    taluka: "Bhor",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Bhor",
    schemeCode: "HADP04",
    schemeName: "HADP Infrastructure Upgrade",
    head: "—",
    demandAmount: 20000,
    spillAmount: 52.15,
    remainingBalance: 147.85,
    status: "Approved"
  },
  {
    districtCode: "HADP-MUL",
    district: "Pune",
    taluka: "Mulshi",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Mulshi",
    schemeCode: "HADP05",
    schemeName: "HADP Special Grant",
    head: "—",
    demandAmount: 20000,
    spillAmount: 60,
    remainingBalance: 140.00,
    status: "Approved"
  },
  {
    districtCode: "HADP-VEL",
    district: "Pune",
    taluka: "Velhe",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Velhe",
    schemeCode: "HADP06",
    schemeName: "HADP Village Development",
    head: "—",
    demandAmount: 20000,
    spillAmount: 65,
    remainingBalance: 135.00,
    status: "Approved"
  },
  {
    districtCode: "HADP-PUR",
    district: "Pune",
    taluka: "Purandar",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Purandar",
    schemeCode: "HADP07",
    schemeName: "HADP Sustainable Growth",
    head: "—",
    demandAmount: 20000,
    spillAmount: 22.29,
    remainingBalance: 177.71,
    status: "Approved"
  },
  {
    districtCode: "HADP-KHE",
    district: "Pune",
    taluka: "Khed",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Khed",
    schemeCode: "HADP08",
    schemeName: "HADP Rural Roads",
    head: "—",
    demandAmount: 20000,
    spillAmount: 101.98,
    remainingBalance: 98.02,
    status: "Approved"
  },
  {
    districtCode: "HADP-HAW",
    district: "Pune",
    taluka: "Haweli",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Haweli",
    schemeCode: "HADP09",
    schemeName: "HADP Green Pune",
    head: "—",
    demandAmount: 20000,
    spillAmount: 33.54,
    remainingBalance: 166.46,
    status: "Approved"
  },
  {
    districtCode: "HADP-SHI",
    district: "Pune",
    taluka: "Shirur",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Shirur",
    schemeCode: "HADP10",
    schemeName: "HADP Urban-Rural Link",
    head: "—",
    demandAmount: 10000,
    spillAmount: 49.98,
    remainingBalance: 50.02,
    status: "Approved"
  },
  {
    districtCode: "HADP-DAU",
    district: "Pune",
    taluka: "Daund",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Daund",
    schemeCode: "HADP11",
    schemeName: "HADP Development Package",
    head: "—",
    demandAmount: 10000,
    spillAmount: 105,
    remainingBalance: -5.00,
    status: "Approved"
  }
];

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
    // one MLC sample
    { district: "PUNE", taluka: "PUNE", type: "MLC", term: 14, name: "Yogesh Tilekar", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 0 }
  ]
};

/* -------------------------------------------------------------------------- */
/*                                   UTILS                                    */
/* -------------------------------------------------------------------------- */

type Plan = "ML-MLA" | "ML-MLC" | "HADP";

function uniq<T>(arr: T[]) { return Array.from(new Set(arr)); }
function cn(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" "); }
function toCurrency(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return `₹${(n || 0).toLocaleString()}`;
}

/* Searchable combobox */
function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  keepAllFirst = false,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  keepAllFirst?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(() => {
    const arr = [...options];
    const hasAll = keepAllFirst && arr.includes("All");
    const rest = (keepAllFirst ? arr.filter(o => o !== "All") : arr)
      .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    return hasAll ? ["All", ...rest] : rest;
  }, [options, keepAllFirst]);

  const display = value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-9 text-xs", className)}
        >
          <span className={cn(!value && "text-muted-foreground")}>{display}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[180px]" align="start">
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
                  onSelect={(val) => { onValueChange(val); setOpen(false); }}
                  className="cursor-pointer text-xs"
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

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

const BudgetAllocation: React.FC = () => {
  /* ------------------------------- State -------------------------------- */
  const [planType, setPlanType] = useState<Plan>("ML-MLA");

  // ML-MLA
  const [fyML, setFyML] = useState<string>("");
  const [districtML, setDistrictML] = useState<string>("");
  const [constituencyML, setConstituencyML] = useState<string>("");
  const [mlaName, setMlaName] = useState<string>("");

  // ML-MLC
  const [fyMLC, setFyMLC] = useState<string>("");
  const [districtMLC, setDistrictMLC] = useState<string>("");
  const [mlcName, setMlcName] = useState<string>("");

  // HADP
  const [fyHADP, setFyHADP] = useState<string>("");
  const [districtHADP, setDistrictHADP] = useState<string>("");
  const [talukaHADP, setTalukaHADP] = useState<string>("");

  // Common
  const [amount, setAmount] = useState<string>("");

  // Local stores for allocated limits (since no APIs)
  type RowMLAStore = { id: string; fy: string; district: string; constituency: string; mlaName: string; budget: number; active: boolean; };
  type RowMLCStore = { id: string; fy: string; district: string; mlcName: string; budget: number; active: boolean; };
  type RowHADPStore = { id: string; district: string; taluka: string; budget: number; active: boolean; };
  const [storeMLA, setStoreMLA] = useState<RowMLAStore[]>([]);
  const [storeMLC, setStoreMLC] = useState<RowMLCStore[]>([]);
  const [storeHADP, setStoreHADP] = useState<RowHADPStore[]>([]);

  /* ----------------------------- Options (mock) -------------------------- */
  const mlaData = useMemo(() => mlaMlcData.data.filter(d => d.type === "MLA"), []);
  const mlcData = useMemo(() => mlaMlcData.data.filter(d => d.type === "MLC"), []);

  // ML-MLA options
  const fyOptionsML = useMemo(() => uniq([mlaMlcData.financialYear]), []);
  const districtOptionsML = useMemo(() => uniq(mlaData.map(d => d.district)).sort(), [mlaData]);
  const constituencyOptionsML = useMemo(() => {
    const filtered = mlaData.filter(d => !districtML || d.district === districtML);
    return uniq(filtered.map(d => d.taluka)).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  }, [mlaData, districtML]);
  const mlaNameOptions = useMemo(() => {
    const filtered = mlaData.filter(d =>
      (!districtML || d.district === districtML) &&
      (!constituencyML || d.taluka === constituencyML)
    );
    return uniq(filtered.map(d => d.name)).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  }, [mlaData, districtML, constituencyML]);

  // ML-MLC options
  const fyOptionsMLC = useMemo(() => uniq([mlaMlcData.financialYear]), []);
  const districtOptionsMLC = useMemo(() => uniq(mlcData.map(d => d.district)).sort(), [mlcData]);
  const mlcNameOptions = useMemo(() => {
    const filtered = mlcData.filter(d => !districtMLC || d.district === districtMLC);
    return uniq(filtered.map(d => d.name)).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  }, [mlcData, districtMLC]);

  // HADP options
  const fyOptionsHADP = useMemo(() => uniq(hadpMock.map(h => h.financialYear)), []);
  const districtOptionsHADP = useMemo(() => uniq(hadpMock.map(h => h.district)).sort(), []);
  const talukaOptionsHADP = useMemo(() => {
    const filtered = hadpMock.filter(h => !districtHADP || h.district === districtHADP);
    return uniq(filtered.map(h => h.taluka)).sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
  }, [districtHADP]);

  /* --------------------------- Effects / Resets -------------------------- */
  useEffect(() => {
    setAmount("");
    if (planType === "ML-MLA") {
      setFyML(fyOptionsML[0] || "");
      setDistrictML(districtOptionsML[0] || "");
      setConstituencyML("");
      setMlaName("");
    } else if (planType === "ML-MLC") {
      setFyMLC(fyOptionsMLC[0] || "");
      setDistrictMLC(districtOptionsMLC[0] || "");
      setMlcName("");
    } else {
      setFyHADP(fyOptionsHADP[0] || "");
      setDistrictHADP(districtOptionsHADP[0] || "");
      setTalukaHADP("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planType]);

  useEffect(() => { setConstituencyML(""); setMlaName(""); }, [districtML]);
  useEffect(() => { setMlaName(""); }, [constituencyML]);
  useEffect(() => { setTalukaHADP(""); }, [districtHADP]);

  /* ------------------------------- Lookups -------------------------------- */
  const mapMLA = useMemo(() => {
    const m = new Map<string, RowMLAStore>();
    storeMLA.forEach(r => m.set(r.id, r));
    return m;
  }, [storeMLA]);

  const mapMLC = useMemo(() => {
    const m = new Map<string, RowMLCStore>();
    storeMLC.forEach(r => m.set(r.id, r));
    return m;
  }, [storeMLC]);

  const mapHADP = useMemo(() => {
    const m = new Map<string, RowHADPStore>();
    storeHADP.forEach(r => m.set(r.id, r));
    return m;
  }, [storeHADP]);

  /* ------------------------------- Actions -------------------------------- */
  const allocate = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return alert("Please enter a valid Amount.");

    if (planType === "ML-MLA") {
      if (!fyML || !districtML || !constituencyML || !mlaName) {
        return alert("Please select FY, District, Constituency and MLA Name.");
      }
      const id = `${fyML}|${districtML}|${constituencyML}|${mlaName}`;
      setStoreMLA(prev => {
        const idx = prev.findIndex(r => r.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], budget: amt };
          return copy;
        }
        return [...prev, { id, fy: fyML, district: districtML, constituency: constituencyML, mlaName, budget: amt, active: true }];
      });
      setAmount("");
    } else if (planType === "ML-MLC") {
      if (!fyMLC || !districtMLC || !mlcName) {
        return alert("Please select FY, District and MLC Name.");
      }
      const id = `${fyMLC}|${districtMLC}|${mlcName}`;
      setStoreMLC(prev => {
        const idx = prev.findIndex(r => r.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], budget: amt };
          return copy;
        }
        return [...prev, { id, fy: fyMLC, district: districtMLC, mlcName, budget: amt, active: true }];
      });
      setAmount("");
    } else {
      if (!fyHADP || !districtHADP || !talukaHADP) {
        return alert("Please select FY, District and Taluka.");
      }
      const id = `${districtHADP}|${talukaHADP}`;
      setStoreHADP(prev => {
        const idx = prev.findIndex(r => r.id === id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], budget: amt };
          return copy;
        }
        return [...prev, { id, district: districtHADP, taluka: talukaHADP, budget: amt, active: true }];
      });
      setAmount("");
    }
  };

  const handleEdit = (row: any) => {
    console.log("Edit clicked:", row);
    alert("Hook your edit modal here.");
  };

  const toggleActive = (plan: Plan, id: string) => {
    if (plan === "ML-MLA") {
      setStoreMLA(list => {
        const found = list.find(r => r.id === id);
        if (!found) return [...list, { id, fy: id.split("|")[0], district: id.split("|")[1], constituency: id.split("|")[2], mlaName: id.split("|")[3], budget: 0, active: false }];
        return list.map(r => r.id === id ? { ...r, active: !r.active } : r);
      });
    } else if (plan === "ML-MLC") {
      setStoreMLC(list => {
        const found = list.find(r => r.id === id);
        if (!found) return [...list, { id, fy: id.split("|")[0], district: id.split("|")[1], mlcName: id.split("|")[2], budget: 0, active: false }];
        return list.map(r => r.id === id ? { ...r, active: !r.active } : r);
      });
    } else {
      setStoreHADP(list => {
        const found = list.find(r => r.id === id);
        if (!found) return [...list, { id, district: id.split("|")[0], taluka: id.split("|")[1], budget: 0, active: false }];
        return list.map(r => r.id === id ? { ...r, active: !r.active } : r);
      });
    }
  };

  /* ------------------------------- Tables (derived from mock + limits) ---- */
  // MLA render rows from mock filtered + joined with limits
  const tableMLA = useMemo(() => {
    const base = mlaData
      .filter(r => !districtML || r.district === districtML)
      .filter(r => !constituencyML || r.taluka === constituencyML)
      .filter(r => !mlaName || r.name === mlaName);

    const seen = new Set<string>();
    const rows = base.map(r => {
      const id = `${fyML || mlaMlcData.financialYear}|${r.district}|${r.taluka}|${r.name}`;
      if (seen.has(id)) return null;
      seen.add(id);
      const found = mapMLA.get(id);
      const limit = found?.budget ?? null;
      const active = found?.active ?? true;
      return {
        id,
        fy: fyML || mlaMlcData.financialYear,
        constituency: r.taluka,
        mlaName: r.name,
        limit,
        revised: limit !== null ? Math.round(limit * 1.5) : null,
        active
      };
    }).filter(Boolean) as Array<{id: string; fy: string; constituency: string; mlaName: string; limit: number|null; revised: number|null; active: boolean}>;

    return rows.sort((a, b) => a.mlaName.localeCompare(b.mlaName, "en", { sensitivity: "base" }));
  }, [mlaData, districtML, constituencyML, mlaName, fyML, mapMLA]);

  // MLC render rows
  const tableMLC = useMemo(() => {
    const base = mlcData
      .filter(r => !districtMLC || r.district === districtMLC)
      .filter(r => !mlcName || r.name === mlcName);

    const seen = new Set<string>();
    const rows = base.map(r => {
      const id = `${fyMLC || mlaMlcData.financialYear}|${r.district}|${r.name}`;
      if (seen.has(id)) return null;
      seen.add(id);
      const found = mapMLC.get(id);
      const limit = found?.budget ?? null;
      const active = found?.active ?? true;
      return {
        id,
        fy: fyMLC || mlaMlcData.financialYear,
        district: r.district,
        mlcName: r.name,
        limit,
        revised: limit !== null ? Math.round(limit * 1.5) : null,
        active
      };
    }).filter(Boolean) as Array<{id: string; fy: string; district: string; mlcName: string; limit: number|null; revised: number|null; active: boolean}>;

    return rows.sort((a, b) => a.mlcName.localeCompare(b.mlcName, "en", { sensitivity: "base" }));
  }, [mlcData, districtMLC, mlcName, fyMLC, mapMLC]);

  // HADP render rows
  const tableHADP = useMemo(() => {
    const base = hadpMock
      .filter(r => !fyHADP || r.financialYear === fyHADP)
      .filter(r => !districtHADP || r.district === districtHADP)
      .filter(r => !talukaHADP || r.taluka === talukaHADP);

    const seen = new Set<string>();
    const rows = base.map(r => {
      const id = `${r.district}|${r.taluka}`;
      if (seen.has(id)) return null;
      seen.add(id);
      const found = mapHADP.get(id);
      const limit = found?.budget ?? null;
      const active = found?.active ?? true;
      return {
        id,
        district: r.district,
        taluka: r.taluka,
        limit,
        active
      };
    }).filter(Boolean) as Array<{id: string; district: string; taluka: string; limit: number|null; active: boolean}>;

    return rows.sort((a, b) => a.taluka.localeCompare(b.taluka, "en", { sensitivity: "base" }));
  }, [hadpMock, fyHADP, districtHADP, talukaHADP, mapHADP]);

  /* --------------------------------- UI ---------------------------------- */
  return (
    <div className="p-4 space-y-6">
      {/* Filters Compartment (compact grid, no horizontal scroll) */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Budget Allocation – Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-12 gap-3 items-end">
            {/* Plan Type */}
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
              <Label className="mb-1 block text-xs">Plan Type</Label>
              <SearchableSelect
                value={planType}
                onValueChange={v => setPlanType(v as Plan)}
                options={["ML-MLA", "ML-MLC", "HADP"]}
              />
            </div>

            {/* ML-MLA filters */}
            {planType === "ML-MLA" && (
              <>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">Financial Year</Label>
                  <SearchableSelect value={fyML} onValueChange={setFyML} options={fyOptionsML} />
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">District</Label>
                  <SearchableSelect value={districtML} onValueChange={setDistrictML} options={districtOptionsML} />
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">Constituency</Label>
                  <SearchableSelect value={constituencyML} onValueChange={setConstituencyML} options={constituencyOptionsML} />
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">MLA Name</Label>
                  <SearchableSelect value={mlaName} onValueChange={setMlaName} options={mlaNameOptions} />
                </div>
              </>
            )}

            {/* ML-MLC filters */}
            {planType === "ML-MLC" && (
              <>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">Financial Year</Label>
                  <SearchableSelect value={fyMLC} onValueChange={setFyMLC} options={fyOptionsMLC} />
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">District</Label>
                  <SearchableSelect value={districtMLC} onValueChange={setDistrictMLC} options={districtOptionsMLC} />
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">MLC Name</Label>
                  <SearchableSelect value={mlcName} onValueChange={setMlcName} options={mlcNameOptions} />
                </div>
              </>
            )}

            {/* HADP filters */}
            {planType === "HADP" && (
              <>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">Financial Year</Label>
                  <SearchableSelect value={fyHADP} onValueChange={setFyHADP} options={fyOptionsHADP} />
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">District</Label>
                  <SearchableSelect value={districtHADP} onValueChange={setDistrictHADP} options={districtOptionsHADP} />
                </div>
                <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                  <Label className="mb-1 block text-xs">Taluka</Label>
                  <SearchableSelect value={talukaHADP} onValueChange={setTalukaHADP} options={talukaOptionsHADP} />
                </div>
              </>
            )}

            {/* Amount + Allocate (common) */}
            <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2">
              <Label className="mb-1 block text-xs" htmlFor="alloc">Amount (₹)</Label>
              <Input id="alloc" type="number" className="h-9 text-xs" placeholder="e.g. 150000" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="col-span-6 sm:col-span-2 md:col-span-1 lg:col-span-1 flex">
              <Button className="h-9 w-full md:w-auto" onClick={allocate}>Allocate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tables */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Budget Allocations(*All Amounts in Thousands)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {/* MLA Table */}
          {planType === "ML-MLA" && (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {["Sr No", "FY", "Constituency", "MLA Name", "Budget Limit Amount", "Actions"]
                    .map(h => (
                      <TableHead key={h} className="border px-2 py-1 text-xs font-medium">{h}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableMLA.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-4 text-sm">No records found for selected filters.</TableCell></TableRow>
                ) : (
                  tableMLA.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell className="border px-2 py-1 text-xs">{i + 1}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.fy}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.constituency}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.mlaName}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{toCurrency(row.limit)}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>Edit</Button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleActive("ML-MLA", row.id)}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs border",
                              row.active ? "bg-green-50 border-green-400 text-green-700" : "bg-gray-50 border-gray-300 text-gray-600"
                            )}
                          >
                            {row.active ? "Active" : "Inactive"}
                          </motion.button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* MLC Table (no Constituency) */}
          {planType === "ML-MLC" && (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {["Sr No", "FY", "District", "MLC Name", "Budget Limit Amount", "Revised Budget (x1.5)", "Actions"]
                    .map(h => (
                      <TableHead key={h} className="border px-2 py-1 text-xs font-medium">{h}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableMLC.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-4 text-sm">No records found for selected filters.</TableCell></TableRow>
                ) : (
                  tableMLC.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell className="border px-2 py-1 text-xs">{i + 1}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.fy}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.district}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.mlcName}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{toCurrency(row.limit)}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{toCurrency(row.revised ?? undefined)}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>Edit</Button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleActive("ML-MLC", row.id)}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs border",
                              row.active ? "bg-green-50 border-green-400 text-green-700" : "bg-gray-50 border-gray-300 text-gray-600"
                            )}
                          >
                            {row.active ? "Active" : "Inactive"}
                          </motion.button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* HADP Table */}
          {planType === "HADP" && (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {["Sr No", "District Name", "Taluka Name", "Budget Amount Limit", "Actions"]
                    .map(h => (
                      <TableHead key={h} className="border px-2 py-1 text-xs font-medium">{h}</TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableHADP.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4 text-sm">No records found for selected filters.</TableCell></TableRow>
                ) : (
                  tableHADP.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell className="border px-2 py-1 text-xs">{i + 1}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.id.split("|")[0]}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{row.taluka}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">{toCurrency(row.limit)}</TableCell>
                      <TableCell className="border px-2 py-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>Edit</Button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleActive("HADP", row.id)}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs border",
                              row.active ? "bg-green-50 border-green-400 text-green-700" : "bg-gray-50 border-gray-300 text-gray-600"
                            )}
                          >
                            {row.active ? "Active" : "Inactive"}
                          </motion.button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetAllocation;
