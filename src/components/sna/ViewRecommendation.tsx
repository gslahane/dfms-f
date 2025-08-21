// src/components/MlaRecommendation.tsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  ChevronsUpDown,
  Check,
  Pencil,
  Eye,
  FileText,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";

/* ----------------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------------*/
type Status = "Pending" | "Sanctioned" | "Approved";

interface Work {
  id: number;
  workCode: string;
  name: string;
  district: string;
  constituency: string;
  mlaName: string;
  financialYear: string;
  recommendedAmount: number; // recommended by MLA
  mlaLetterNo: string;
}

interface RecommendationRow {
  id: number;                    // work id
  work: Work;
  iaName: string;                // Implementing Agency
  aaAmount?: number | null;      // Admin Approval amount (sanction)
  aaLetterNo?: string | null;    // AA Letter No.
  aaLetterFileName?: string | null; // (uploaded) file name
  fundDisbursed: number;         // amount disbursed so far
  status: Status;
}

/* ----------------------------------------------------------------------------
 * Mock Data
 * --------------------------------------------------------------------------*/
const IA_OPTIONS = [
  "Executive Engineer, Public Works North Division, Pune",
  "Executive Engineer, ZP Pune (Rural Works)",
  "Chief Officer, Pune Municipal Corporation",
  "Executive Engineer, Water Resources Dept., Pune",
  "Executive Engineer, Rural Development Dept., Pune",
];

const works: Work[] = [
  {
    id: 228,
    workCode: "ML/2425/5498",
    name: "मौजे शिरवळ येथे महिला सामाजिक भवन बांधणे ता.आंबेगाव",
    district: "Pune",
    constituency: "Ambegaon",
    mlaName: "Shri Dilip Dattatray Walse",
    financialYear: "2024-25",
    recommendedAmount: 1500, // (₹ in lakhs/thousands as per your UI)
    mlaLetterNo: "ML/2425/5498",
  },
  {
    id: 259,
    workCode: "ML/2425/5465",
    name: "मौजे पाबळ येथे सार्वजनिक सभागृह बांधणे ता.आंबेगाव",
    district: "Pune",
    constituency: "Ambegaon",
    mlaName: "Shri Dilip Dattatray Walse",
    financialYear: "2024-25",
    recommendedAmount: 2000,
    mlaLetterNo: "ML/2425/5465",
  },
  {
    id: 260,
    workCode: "ML/2425/5464",
    name: "गावढाबा येथे अंतर्गत रस्ता डांबरीकरण करणे ता.मावळ",
    district: "Pune",
    constituency: "Maval",
    mlaName: "Sunil Shankarrao Shelke",
    financialYear: "2024-25",
    recommendedAmount: 1500,
    mlaLetterNo: "ML/2425/5464",
  },
  {
    id: 261,
    workCode: "ML/2425/5566",
    name: "बारामती येथे क्रीडा संकुल दुरुस्ती",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    financialYear: "2024-25",
    recommendedAmount: 1200,
    mlaLetterNo: "ML/2425/5566",
  },
];

// Seed table rows from works
const initialRows: RecommendationRow[] = works.map((w) => ({
  id: w.id,
  work: w,
  iaName: IA_OPTIONS[0],
  aaAmount: null,
  aaLetterNo: null,
  aaLetterFileName: null,
  fundDisbursed: 0,
  status: "Pending",
}));

/* ----------------------------------------------------------------------------
 * Small utils
 * --------------------------------------------------------------------------*/
const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const toCurrency = (n: number) => `₹${(n || 0).toLocaleString()}`;

/* ----------------------------------------------------------------------------
 * SearchableSelect (combobox)
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
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-9 text-xs", className)}
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[220px]" align="start">
        <Command>
          <CommandInput placeholder="Type to search…" className="h-9 text-xs" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {sorted.map((opt) => {
              const selected = value === opt;
              return (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={(val) => {
                    onChange(val);
                    setOpen(false);
                  }}
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
 * Status pill
 * --------------------------------------------------------------------------*/
function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { bg: string; text: string; label: string }> = {
    Pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending" },
    Sanctioned: { bg: "bg-blue-100", text: "text-blue-800", label: "Sanctioned" },
    Approved: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Approved" },
  };
  const s = map[status];
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", s.bg, s.text)}>
      {s.label}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * Edit Dialog (per row)
 * --------------------------------------------------------------------------*/
function EditRecommendationDialog({
  open,
  onOpenChange,
  row,
  iaOptions,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  row: RecommendationRow | null;
  iaOptions: string[];
  onSave: (patch: Partial<RecommendationRow>) => void;
}) {
  const [ia, setIa] = useState(row?.iaName || "");
  const [aaAmt, setAaAmt] = useState<string>(row?.aaAmount ? String(row.aaAmount) : "");
  const [aaLetterNo, setAaLetterNo] = useState<string>(row?.aaLetterNo || "");
  const [aaFileName, setAaFileName] = useState<string | null>(row?.aaLetterFileName || null);

  // validation state
  const [touched, setTouched] = useState<{ ia?: boolean; amt?: boolean; no?: boolean }>({});

  // Reset when row changes
  React.useEffect(() => {
    setIa(row?.iaName || "");
    setAaAmt(row?.aaAmount ? String(row.aaAmount) : "");
    setAaLetterNo(row?.aaLetterNo || "");
    setAaFileName(row?.aaLetterFileName || null);
    setTouched({});
  }, [row]);

  const toCurrency = (n: number) => `₹${(n || 0).toLocaleString()}`;
  const nAA = aaAmt.trim() === "" ? null : Number(aaAmt);
  const hasAmt = nAA !== null && !Number.isNaN(nAA);
  const iaError = touched.ia && !ia ? "Implementing agency is required." : "";
  const amtError =
    touched.amt && (!hasAmt || (nAA as number) <= 0)
      ? "Enter a valid AA amount greater than 0."
      : "";
  const noError = touched.no && hasAmt && !aaLetterNo ? "AA Letter No. is required when AA amount is entered." : "";

  const isValid = !!ia && hasAmt && (aaLetterNo?.trim().length ?? 0) > 0;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAaFileName(f.name);
  };

  // simple drag-drop
  const onDrop: React.DragEventHandler<HTMLLabelElement> = (ev) => {
    ev.preventDefault();
    const f = ev.dataTransfer.files?.[0];
    if (f) setAaFileName(f.name);
  };

  const save = () => {
    if (!isValid) {
      setTouched({ ia: true, amt: true, no: true });
      return;
    }
    onSave({
      iaName: ia,
      aaAmount: nAA,
      aaLetterNo: aaLetterNo || null,
      aaLetterFileName: aaFileName || null,
    });
    onOpenChange(false);
  };

  if (!row) return null;

  const recommended = row.work.recommendedAmount || 0;
  const aaAmountNum = nAA || 0;
  const pendingVsRec = Math.max(0, aaAmountNum - (row.fundDisbursed || 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        {/* Header strip */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-indigo-900">
                Edit &amp; Sanction – {row.work.workCode}
              </h3>
              <p className="mt-0.5 text-xs text-indigo-800/80">
                {row.work.name}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-white/70 border border-indigo-200 text-indigo-800">
                  MLA: {row.work.mlaName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/70 border border-indigo-200 text-indigo-800">
                  District: {row.work.district}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/70 border border-indigo-200 text-indigo-800">
                  FY: {row.work.financialYear}
                </span>
              </div>
            </div>
            <div className="text-right text-[11px] text-indigo-900">
              <div className="font-semibold">Recommended</div>
              <div className="text-lg">{toCurrency(recommended)}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Compact KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded-md p-3 border-l-4 border-emerald-500 bg-emerald-50">
              <p className="text-[11px] font-semibold text-emerald-700 uppercase">AA Amount</p>
              <p className="text-lg font-bold text-emerald-900">{toCurrency(aaAmountNum)}</p>
            </div>
            <div className="rounded-md p-3 border-l-4 border-blue-500 bg-blue-50">
              <p className="text-[11px] font-semibold text-blue-700 uppercase">Disbursed So Far</p>
              <p className="text-lg font-bold text-blue-900">{toCurrency(row.fundDisbursed || 0)}</p>
            </div>
            <div className="rounded-md p-3 border-l-4 border-amber-500 bg-amber-50">
              <p className="text-[11px] font-semibold text-amber-700 uppercase">Pending (AA − Disbursed)</p>
              <p className="text-lg font-bold text-amber-900">{toCurrency(pendingVsRec)}</p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* IA */}
            <div>
              <Label className="text-xs">Implementing Agency <span className="text-red-500">*</span></Label>
              <SearchableSelect value={ia} onChange={(v) => { setIa(v); setTouched(t => ({ ...t, ia: true })); }} options={iaOptions} />
              {iaError && <p className="mt-1 text-[11px] text-red-600">{iaError}</p>}
              <p className="mt-1 text-[11px] text-gray-500">Choose the executing department/agency responsible for the work.</p>
            </div>

            {/* AA Amount */}
            <div>
              <Label htmlFor="aaAmt" className="text-xs">AA Amount (₹) <span className="text-red-500">*</span></Label>
              <Input
                id="aaAmt"
                type="number"
                value={aaAmt}
                onChange={(e) => { setAaAmt(e.target.value); setTouched(t => ({ ...t, amt: true })); }}
                placeholder="e.g. 1500"
                className="h-9 text-sm"
              />
              {amtError && <p className="mt-1 text-[11px] text-red-600">{amtError}</p>}
              <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                <span>Tip: AA should not exceed the available MLA limit.</span>
                <button
                  type="button"
                  className="underline text-blue-700"
                  onClick={() => { setAaAmt(String(recommended)); setTouched(t => ({ ...t, amt: true })); }}
                >
                  Fill from Recommended
                </button>
              </div>
            </div>

            {/* AA Letter No */}
            <div>
              <Label htmlFor="aaNo" className="text-xs">AA Letter No. <span className="text-red-500">*</span></Label>
              <Input
                id="aaNo"
                value={aaLetterNo}
                onChange={(e) => { setAaLetterNo(e.target.value); setTouched(t => ({ ...t, no: true })); }}
                placeholder="e.g. PWD/AA/2024/123"
                className="h-9 text-sm"
              />
              {noError && <p className="mt-1 text-[11px] text-red-600">{noError}</p>}
              <p className="mt-1 text-[11px] text-gray-500">Enter the official AA reference number issued by the sanctioning authority.</p>
            </div>

            {/* Upload */}
            <div>
              <Label className="text-xs">Upload AA Letter (PDF / DOCX)</Label>
              <label
                htmlFor="aaFile"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="mt-1 flex items-center justify-center gap-2 h-24 rounded-md border border-dashed hover:border-blue-400 hover:bg-blue-50/40 transition-colors cursor-pointer"
                title="Click or drag a file"
              >
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span className="text-[12px] text-blue-700">Click or drag to upload</span>
              </label>
              <input id="aaFile" type="file" className="hidden" onChange={handleFile} />
              <div className="mt-1 text-[12px] text-gray-600 truncate">
                {aaFileName ? <>Selected: <span className="font-medium">{aaFileName}</span></> : "No file chosen"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={!isValid}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ----------------------------------------------------------------------------
 * Main Component
 * --------------------------------------------------------------------------*/
export default function MlaRecommendation() {
  const [rows, setRows] = useState<RecommendationRow[]>(initialRows);

  // Filters
  const [fy, setFy] = useState<string>("All");
  const [district, setDistrict] = useState<string>("All");
  const [constituency, setConstituency] = useState<string>("All");
  const [mlaName, setMlaName] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Edit dialog state
  const [editingId, setEditingId] = useState<number | null>(null);
  const editingRow = rows.find((r) => r.id === editingId) || null;
  const [editOpen, setEditOpen] = useState(false);

  // Filter options
  const fyOptions = useMemo(
    () => ["All", ...uniq(rows.map((r) => r.work.financialYear))],
    [rows]
  );
  const districtOptions = useMemo(
    () => ["All", ...uniq(rows.map((r) => r.work.district))],
    [rows]
  );
  const constituencyOptions = useMemo(
    () =>
      ["All", ...uniq(rows
        .filter((r) => (district === "All" ? true : r.work.district === district))
        .map((r) => r.work.constituency))],
    [rows, district]
  );
  const mlaOptions = useMemo(
    () =>
      ["All", ...uniq(rows
        .filter((r) => (district === "All" ? true : r.work.district === district))
        .filter((r) => (constituency === "All" ? true : r.work.constituency === constituency))
        .map((r) => r.work.mlaName))],
    [rows, district, constituency]
  );
  const statusOptions = ["All", "Pending", "Sanctioned", "Approved"];

  // Filtered rows
  const visible = rows.filter((r) => {
    if (fy !== "All" && r.work.financialYear !== fy) return false;
    if (district !== "All" && r.work.district !== district) return false;
    if (constituency !== "All" && r.work.constituency !== constituency) return false;
    if (mlaName !== "All" && r.work.mlaName !== mlaName) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return true;
  });

  // Metrics (on filtered)
  const totalRecommended = visible.reduce((s, r) => s + r.work.recommendedAmount, 0);
  const totalCount = visible.length;
  const totalPending = visible.filter((r) => r.status === "Pending").length;

  // Actions
  const saveEdit = (patch: Partial<RecommendationRow>) => {
    setRows((list) =>
      list.map((r) => (r.id === editingId ? { ...r, ...patch } : r))
    );
  };

  const approveRow = (id: number) => {
    setRows((list) =>
      list.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };

  const sanctionRow = (id: number) => {
    setRows((list) =>
      list.map((r) => {
        if (r.id !== id) return r;
        if (!r.aaAmount || !r.aaLetterNo) {
          alert("Please add AA Amount and AA Letter first (Edit), then Sanction.");
          return r;
        }
        return { ...r, status: "Sanctioned" };
      })
    );
  };

  const openEdit = (id: number) => {
    setEditingId(id);
    setEditOpen(true);
  };

  /* -------------------------------- Render ------------------------------- */
  return (
    <div className="p-6 space-y-6 bg-gray-50">

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="rounded-md p-4 shadow-sm border-l-4 border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold text-indigo-700 uppercase">Total Recommended Amount</p>
          <p className="mt-1 text-2xl font-bold text-indigo-900">{toCurrency(totalRecommended)}</p>
          <p className="text-[11px] text-indigo-700/70 mt-1">Within current filters</p>
        </motion.div>

        <motion.div
          className="rounded-md p-4 shadow-sm border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        >
          <p className="text-xs font-semibold text-emerald-700 uppercase">Total Recommendations</p>
          <p className="mt-1 text-2xl font-bold text-emerald-900">{totalCount}</p>
          <p className="text-[11px] text-emerald-700/70 mt-1">Records listed below</p>
        </motion.div>

        <motion.div
          className="rounded-md p-4 shadow-sm border-l-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <p className="text-xs font-semibold text-amber-700 uppercase">Fund Demands Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{totalPending}</p>
          <p className="text-[11px] text-amber-700/70 mt-1">
            {district === "All" ? "All districts" : `District: ${district}`}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
              <Label className="text-[11px] mb-1 block">Financial Year</Label>
              <SearchableSelect value={fy} onChange={setFy} options={fyOptions} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
              <Label className="text-[11px] mb-1 block">Nodal District</Label>
              <SearchableSelect value={district} onChange={setDistrict} options={districtOptions} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
              <Label className="text-[11px] mb-1 block">Assembly Constituency</Label>
              <SearchableSelect value={constituency} onChange={setConstituency} options={constituencyOptions} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
              <Label className="text-[11px] mb-1 block">MLA Name</Label>
              <SearchableSelect value={mlaName} onChange={setMlaName} options={mlaOptions} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-1">
              <Label className="text-[11px] mb-1 block">Status</Label>
              <SearchableSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-full table-fixed text-xs">
  <TableHeader>
    <TableRow>
      {[
        "Sr No",
        "Work Name",
        "IA Name",
        "MLA Letter",
        "Recommended Amount",
        "AA Amount",
        "AA Letter",
        "Fund Disbursed",
        "Pending Amount",
        "Status",
        "Actions",
      ].map((h) => (
        <TableHead
          key={h}
          className="border px-2 py-1 text-[11px] font-semibold whitespace-nowrap"
        >
          {h}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>

  <TableBody>
    {visible.length === 0 ? (
      <TableRow>
        <TableCell colSpan={11} className="text-center py-6 text-sm text-gray-500">
          No records found.
        </TableCell>
      </TableRow>
    ) : (
      visible.map((r, idx) => {
        const pending = Math.max(0, (r.aaAmount || 0) - (r.fundDisbursed || 0));
        return (
          <TableRow key={r.id} className="hover:bg-gray-50">
            {/* Sr No */}
            <TableCell className="border px-2 py-1">{idx + 1}</TableCell>

            {/* Work name + FY (compact, truncated) */}
            <TableCell className="border px-2 py-1 align-top">
              <div className="font-medium truncate max-w-[320px]">
                {r.work.name}
              </div>
              <div className="text-[11px] text-gray-500">FY: {r.work.financialYear}</div>
            </TableCell>

            {/* IA Name (truncate) */}
            <TableCell className="border px-2 py-1">
              <div className="truncate max-w-[220px]">{r.iaName}</div>
            </TableCell>

            {/* MLA Letter (compact link) */}
            <TableCell className="border px-2 py-1">
              <div className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-gray-600" />
                <a
                  className="text-blue-600 underline text-[12px] truncate max-w-[150px]"
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  title={r.work.mlaLetterNo}
                >
                  {r.work.mlaLetterNo}
                </a>
              </div>
            </TableCell>

            {/* Amounts (right aligned, tabular nums) */}
            <TableCell className="border px-2 py-1 text-right tabular-nums whitespace-nowrap">
              {toCurrency(r.work.recommendedAmount)}
            </TableCell>

            <TableCell className="border px-2 py-1 text-right tabular-nums whitespace-nowrap">
              {r.aaAmount ? toCurrency(r.aaAmount) : "—"}
            </TableCell>

            {/* AA Letter */}
            <TableCell className="border px-2 py-1">
              {r.aaLetterNo ? (
                <div className="flex items-center gap-1 text-blue-700">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="underline text-[12px] truncate max-w-[140px]" title={r.aaLetterNo}>
                    {r.aaLetterNo}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 text-[12px]">Not Assigned</span>
              )}
            </TableCell>

            <TableCell className="border px-2 py-1 text-right tabular-nums text-emerald-700 whitespace-nowrap">
              {toCurrency(r.fundDisbursed)}
            </TableCell>

            <TableCell className="border px-2 py-1 text-right tabular-nums whitespace-nowrap">
              {toCurrency(pending)}
            </TableCell>

            {/* Status */}
            <TableCell className="border px-2 py-1">
              <StatusPill status={r.status} />
            </TableCell>

            {/* Actions: tiny buttons, d-flex */}
            <TableCell className="border px-2 py-1">
              <div className="flex items-center flex-wrap gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Work Details – {r.work.workCode}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {r.work.name}</div>
                      <div><strong>District:</strong> {r.work.district}</div>
                      <div><strong>Constituency:</strong> {r.work.constituency}</div>
                      <div><strong>MLA:</strong> {r.work.mlaName}</div>
                      <div><strong>Financial Year:</strong> {r.work.financialYear}</div>
                      <div><strong>Recommended Amount:</strong> {toCurrency(r.work.recommendedAmount)}</div>
                      <div><strong>IA:</strong> {r.iaName}</div>
                      <div><strong>AA Amount:</strong> {r.aaAmount ? toCurrency(r.aaAmount) : "—"}</div>
                      <div><strong>AA Letter:</strong> {r.aaLetterNo || "—"}</div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  onClick={() => openEdit(r.id)}
                  className="h-7 px-2 text-[11px]"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>

                <Button
                  onClick={() => sanctionRow(r.id)}
                  className="h-7 px-2 text-[11px] bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={r.status === "Sanctioned" || r.status === "Approved"}
                >
                  Sanction
                </Button>

                <Button
                  onClick={() => approveRow(r.id)}
                  className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={r.status === "Approved"}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Approve
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      })
    )}
  </TableBody>
</Table>

        </CardContent>
      </Card>

      {/* Edit/Sanction Dialog */}
      <EditRecommendationDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        row={editingRow}
        iaOptions={IA_OPTIONS}
        onSave={saveEdit}
      />
    </div>
  );
}
