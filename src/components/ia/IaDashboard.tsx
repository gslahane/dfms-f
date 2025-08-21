// src/components/ia/IaDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, PieChart, CheckCircle2, XCircle, Link2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const baseURL = "http://localhost:5002";

/* ================= Helpers ================= */
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" },
  }),
};

const getFY = (d: any) => d.financialYear || d.fy || d.fyear || "NA";
const getPlanType = (d: any) => d.planType || d.plan || "NA";

const getSchemeId = (d: any) => `${d.schemeId ?? d.schemeID ?? d.scheme_id ?? ""}`;
const getSchemeName = (d: any) => d.schemeName || d.scheme || "NA";

const getWorkId = (d: any) => `${d.workId ?? d.workID ?? d.work_id ?? ""}`;
const getWorkName = (d: any) => d.workName || d.name || "NA";

const getDistrict = (d: any) => d.iaDistrict || d.districtName || d.district || "NA";
const getTaluka = (d: any) => d.talukaName || d.taluka || "";

const getIAId = (d: any) => `${d.iaId ?? d.implementingAgencyId ?? d.ia_id ?? ""}`;
const getIAName = (d: any) => d.iaName || d.ia || "";

const getMLAName = (d: any) => d.mlaName || d.memberName || d.accountName || "";
const getMLCName = (d: any) => d.mlcName || d.memberName || d.accountName || "";

const getWorkType = (d: any) => {
  const raw = (d.workType || d.type || (d.isNodal ? "NODAL" : "NON-NODAL") || "").toString().toUpperCase();
  if (raw.includes("NODAL")) return "NODAL";
  if (raw.includes("NON")) return "NON-NODAL";
  return d.isNodal ? "NODAL" : "NON-NODAL";
};

const getDemandAmount = (d: any) => Number(d.demandAmount ?? d.requestedAmount ?? d.totalDemand ?? 0) || 0;
const getAAAmount = (d: any) => Number(d.aaAmount ?? d.adminApprovedAmount ?? d.approvedAmount ?? 0) || 0;
const getGrossWO = (d: any) => Number(d.grossWorkOrderAmount ?? d.grossAmount ?? 0) || 0;
const getReceivedFromState = (d: any) =>
  Number(d.fundReceivedFromState ?? d.amountReceivedFromState ?? d.receivedAmount ?? d.disbursedToIA ?? 0) || 0;

const isAAApproved = (d: any) => {
  const s = (d.aaStatus || d.approvalStatus || d.statusAA || d.status || "").toString().toLowerCase();
  return s === "approved" || d.aaApproved === true;
};
const isRejected = (d: any) => (d.status || d.demandStatus || "").toString().toLowerCase() === "rejected";
const isVendorMapped = (d: any) =>
  Boolean(
    d.vendorMapped === true ||
      d.vendorId ||
      d.vendorID ||
      d.vendor_id ||
      (Array.isArray(d.vendors) && d.vendors.length > 0)
  );

const getVendorMappedAmount = (d: any) => (isVendorMapped(d) ? getAAAmount(d) || getGrossWO(d) || getDemandAmount(d) || 0 : 0);
const getVendorPendingAmount = (d: any) => (!isVendorMapped(d) ? getAAAmount(d) || getGrossWO(d) || getDemandAmount(d) || 0 : 0);

function uniqueBy<T = any>(arr: T[], keyFn: (x: T) => string, labelFn?: (x: T) => string) {
  const map = new Map<string, { id: string; name: string }>();
  for (const item of arr) {
    const id = keyFn(item);
    if (!id) continue;
    const name = labelFn ? labelFn(item) : id;
    if (!map.has(id)) map.set(id, { id, name: name || id });
  }
  return Array.from(map.values());
}

const fmtINR = (n: number) => `₹${(n || 0).toLocaleString()}`;

function mode<T>(arr: T[], idFn: (x: T) => string) {
  const counts = new Map<string, { val: string; c: number }>();
  for (const it of arr) {
    const k = idFn(it);
    if (!k) continue;
    const rec = counts.get(k) || { val: k, c: 0 };
    rec.c += 1;
    counts.set(k, rec);
  }
  let best: { val: string; c: number } | null = null;
  for (const rec of counts.values()) if (!best || rec.c > best.c) best = rec;
  return best?.val || "";
}

/* =============== Compact Metric Card =============== */
type MetricCardProps = {
  i: number;
  title: string;
  subtitle: string;
  value: string | number;
  icon: React.ReactNode;
  shade: string;
  onView?: () => void; // only for COUNT cards
};
const MetricCard: React.FC<MetricCardProps> = ({ i, title, subtitle, value, icon, shade, onView }) => (
  <motion.div initial="hidden" animate="visible" variants={cardVariants} custom={i} className={`${shade} rounded-xl shadow-sm border h-full`}>
    <div className="relative h-full p-3 flex flex-col">
      <div className="flex items-start gap-3">
        <div className="shrink-0">{icon}</div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wide text-gray-600">{subtitle}</div>
          <div className="text-[13px] font-semibold text-gray-800">{title}</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{value}</div>
        </div>
      </div>
      {onView && (
        <div className="mt-auto">
          <Button size="sm" variant="outline" className="mt-2 h-7 px-2 text-[11px]" onClick={onView}>
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>
        </div>
      )}
    </div>
  </motion.div>
);

/* =============== Section Wrapper =============== */
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <Card className="p-3 md:p-4 border border-gray-200 rounded-2xl bg-white h-full">
    <div className="flex items-baseline justify-between mb-2">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle ? <p className="text-[12px] text-gray-500">{subtitle}</p> : null}
      </div>
    </div>
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">{children}</div>
  </Card>
);

/* ================= Component ================= */
export default function IADashboard() {
  const { toast } = useToast();

  // Default FY (India FY Apr–Mar). As of Aug 2025 => 2025-2026.
  const CURRENT_FY = "2025-2026";
  const FY_OPTIONS = ["2024-2025", "2025-2026"];

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Base Filters
  const [financialYear, setFinancialYear] = useState<string>(CURRENT_FY);
  const [planType, setPlanType] = useState<string>("All");

  // Current IA context (derived once data arrives)
  const [currentIAId, setCurrentIAId] = useState<string>("");
  const [currentIADistrict, setCurrentIADistrict] = useState<string>("");

  // MLA chain: IA District (fixed = currentIADistrict) -> MLA name -> Scheme -> Work
  const [mlaName, setMLAName] = useState<string>("All");
  const [mlaSchemeId, setMlaSchemeId] = useState<string>("All");
  const [mlaWorkId, setMlaWorkId] = useState<string>("All");
  const [mlaList, setMlaList] = useState<{ id: string; name: string }[]>([{ id: "All", name: "All" }]);
  const [mlaSchemeList, setMlaSchemeList] = useState<{ id: string; name: string }[]>([{ id: "All", name: "All" }]);
  const [mlaWorkList, setMlaWorkList] = useState<{ id: string; name: string }[]>([{ id: "All", name: "All" }]);

  // MLC chain: MLC name -> NODAL/NON-NODAL -> Work (assigned to current IA)
  const [mlcName, setMLCName] = useState<string>("All");
  const [mlcWorkType, setMlcWorkType] = useState<string>("All"); // NODAL/NON-NODAL
  const [mlcWorkId, setMlcWorkId] = useState<string>("All");
  const [mlcList, setMlcList] = useState<{ id: string; name: string }[]>([{ id: "All", name: "All" }]);
  const [mlcWorkList, setMlcWorkList] = useState<{ id: string; name: string }[]>([{ id: "All", name: "All" }]);

  // HADP chain: Taluka (of current IA district) -> Work (under that taluka)
  const [taluka, setTaluka] = useState<string>("All");
  const [hadpWorkId, setHadpWorkId] = useState<string>("All");
  const [talukaList, setTalukaList] = useState<{ id: string; name: string }[]>([{ id: "All", name: "All" }]);
  const [hadpWorkList, setHadpWorkList] = useState<{ id: string; name: string }[]>([{ id: "All", name: "All" }]);

  // Modal for card views (count cards only)
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTitle, setViewTitle] = useState("");
  const [viewRows, setViewRows] = useState<any[]>([]);

  /* ---- Fetch ---- */
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [financialYear, planType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (financialYear !== "All") params.financialYear = financialYear;
      if (planType !== "All") params.planType = planType;

      const res = await axios.get(`${baseURL}/api/ia-dashboard`, {
        params,
        headers: { Authorization: localStorage.getItem("token") || "" },
      });

      let records: any[] = [];
      if (Array.isArray(res.data)) records = res.data;
      else if (Array.isArray(res.data?.data)) records = res.data.data;

      // derive current IA (from localStorage if available, else mode)
      const storedIA = localStorage.getItem("iaId") || "";
      const iaIdDerived = storedIA || mode(records, getIAId);
      const iaRows = records.filter((r) => getIAId(r) === iaIdDerived);
      const iaDistrictDerived = mode(iaRows.length ? iaRows : records, getDistrict);

      setCurrentIAId(iaIdDerived);
      setCurrentIADistrict(iaDistrictDerived);
      setData(records || []);
    } catch (err) {
      setData([]);
      toast({ title: "Error", description: "Failed to fetch IA Dashboard data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ---- Scope for current FY ---- */
  const scopeFY = useMemo(() => {
    return (Array.isArray(data) ? data : []).filter((d) => (financialYear === "All" ? true : getFY(d) === financialYear));
  }, [data, financialYear]);

  /* ----------------- BUILD DEPENDENT LISTS (per plan type chains) ------------------ */

  // MLA: IA district fixed -> MLA list -> Scheme list for MLA -> Work list under Scheme for MLA
  useEffect(() => {
    if (planType !== "MLA") return;

    const byDistrict = scopeFY.filter((r) => (!currentIADistrict ? true : getDistrict(r) === currentIADistrict));
    const mlas = [{ id: "All", name: "All" }, ...uniqueBy(byDistrict, getMLAName, getMLAName)];
    setMlaList(mlas);
    if (!mlas.find((m) => m.id === mlaName)) setMLAName("All");

    const mlScoped = byDistrict.filter((r) => (mlaName === "All" ? true : getMLAName(r) === mlaName));
    const schemes = [{ id: "All", name: "All" }, ...uniqueBy(mlScoped, getSchemeId, getSchemeName)];
    setMlaSchemeList(schemes);
    if (!schemes.find((s) => s.id === mlaSchemeId)) setMlaSchemeId("All");

    const schemeScoped = mlScoped.filter((r) => (mlaSchemeId === "All" ? true : getSchemeId(r) === mlaSchemeId));
    const works = [{ id: "All", name: "All" }, ...uniqueBy(schemeScoped, getWorkId, getWorkName)];
    setMlaWorkList(works);
    if (!works.find((w) => w.id === mlaWorkId)) setMlaWorkId("All");
    // eslint-disable-next-line
  }, [planType, scopeFY, currentIADistrict, mlaName, mlaSchemeId]);

  // MLC: MLC name -> nodal/non-nodal -> works under that MLC assigned to current IA
  useEffect(() => {
    if (planType !== "MLC") return;

    const base = scopeFY;
    const mlcs = [{ id: "All", name: "All" }, ...uniqueBy(base, getMLCName, getMLCName)];
    setMlcList(mlcs);
    if (!mlcs.find((m) => m.id === mlcName)) setMLCName("All");

    const mlcScoped = base.filter((r) => (mlcName === "All" ? true : getMLCName(r) === mlcName));
    const byType = mlcScoped.filter((r) => (mlcWorkType === "All" ? true : getWorkType(r) === mlcWorkType));

    // Only works assigned to the logged IA
    const byAssignment = byType.filter((r) => !currentIAId || getIAId(r) === currentIAId);

    const works = [{ id: "All", name: "All" }, ...uniqueBy(byAssignment, getWorkId, getWorkName)];
    setMlcWorkList(works);
    if (!works.find((w) => w.id === mlcWorkId)) setMlcWorkId("All");
    // eslint-disable-next-line
  }, [planType, scopeFY, mlcName, mlcWorkType, currentIAId]);

  // HADP: Talukas of current IA district -> works under selected taluka
  useEffect(() => {
    if (planType !== "HADP") return;

    const byDistrict = scopeFY.filter((r) => (!currentIADistrict ? true : getDistrict(r) === currentIADistrict));
    const talukas = [{ id: "All", name: "All" }, ...uniqueBy(byDistrict, getTaluka, getTaluka)];
    setTalukaList(talukas);
    if (!talukas.find((t) => t.id === taluka)) setTaluka("All");

    const byTaluka = byDistrict.filter((r) => (taluka === "All" ? true : getTaluka(r) === taluka));
    const works = [{ id: "All", name: "All" }, ...uniqueBy(byTaluka, getWorkId, getWorkName)];
    setHadpWorkList(works);
    if (!works.find((w) => w.id === hadpWorkId)) setHadpWorkId("All");
    // eslint-disable-next-line
  }, [planType, scopeFY, currentIADistrict, taluka]);

  /* ----------------- FINAL FILTER APPLICATION (per chain) ------------------ */
  const filtered = useMemo(() => {
    let rows = scopeFY;

    if (planType === "MLA") {
      rows = rows.filter((r) => (!currentIADistrict ? true : getDistrict(r) === currentIADistrict));
      rows = rows.filter((r) => (mlaName === "All" ? true : getMLAName(r) === mlaName));
      rows = rows.filter((r) => (mlaSchemeId === "All" ? true : getSchemeId(r) === mlaSchemeId));
      rows = rows.filter((r) => (mlaWorkId === "All" ? true : getWorkId(r) === mlaWorkId));
    } else if (planType === "MLC") {
      rows = rows.filter((r) => (mlcName === "All" ? true : getMLCName(r) === mlcName));
      rows = rows.filter((r) => (mlcWorkType === "All" ? true : getWorkType(r) === mlcWorkType));
      rows = rows.filter((r) => (!currentIAId ? true : getIAId(r) === currentIAId)); // assignment to logged IA
      rows = rows.filter((r) => (mlcWorkId === "All" ? true : getWorkId(r) === mlcWorkId));
    } else if (planType === "HADP") {
      rows = rows.filter((r) => (!currentIADistrict ? true : getDistrict(r) === currentIADistrict));
      rows = rows.filter((r) => (taluka === "All" ? true : getTaluka(r) === taluka));
      rows = rows.filter((r) => (hadpWorkId === "All" ? true : getWorkId(r) === hadpWorkId));
    }

    return rows;
  }, [
    scopeFY,
    planType,
    currentIADistrict,
    currentIAId,
    mlaName,
    mlaSchemeId,
    mlaWorkId,
    mlcName,
    mlcWorkType,
    mlcWorkId,
    taluka,
    hadpWorkId,
  ]);

  /* ---- Stats ---- */
  const aaApprovedRows = useMemo(() => filtered.filter(isAAApproved), [filtered]);
  const vendorDoneRows = useMemo(() => filtered.filter(isVendorMapped), [filtered]);
  const vendorPendingRows = useMemo(() => filtered.filter((d) => !isVendorMapped(d)), [filtered]);
  const rejectedRows = useMemo(() => filtered.filter(isRejected), [filtered]);

  const stats = useMemo(() => {
    const aaApprovedCount = aaApprovedRows.length;
    const aaApprovedAmount = aaApprovedRows.reduce((s, d) => s + getAAAmount(d), 0);
    const vendorDoneCount = vendorDoneRows.length;
    const vendorDoneAmount = vendorDoneRows.reduce((s, d) => s + getVendorMappedAmount(d), 0);
    const vendorPendingCount = vendorPendingRows.length;
    const vendorPendingAmount = vendorPendingRows.reduce((s, d) => s + getVendorPendingAmount(d), 0);
    const rejectedCount = rejectedRows.length;
    const totalDemandedToState = filtered.reduce((s, d) => s + getDemandAmount(d), 0);
    const totalReceivedFromState = filtered.reduce((s, d) => s + getReceivedFromState(d), 0);

    return {
      aaApprovedCount,
      aaApprovedAmount,
      vendorDoneCount,
      vendorDoneAmount,
      vendorPendingCount,
      vendorPendingAmount,
      rejectedCount,
      totalDemandedToState,
      totalReceivedFromState,
    };
  }, [filtered, aaApprovedRows, vendorDoneRows, vendorPendingRows, rejectedRows]);

  /* ---- Charts ---- */
  const byFY = useMemo(() => {
    const map = new Map<string, { fy: string; demanded: number; received: number }>();
    for (const d of filtered) {
      const fy = getFY(d);
      if (!map.has(fy)) map.set(fy, { fy, demanded: 0, received: 0 });
      const row = map.get(fy)!;
      row.demanded += getDemandAmount(d);
      row.received += getReceivedFromState(d);
    }
    return Array.from(map.values()).sort((a, b) => (a.fy > b.fy ? 1 : -1));
  }, [filtered]);

  const vendorPie = useMemo(
    () => [
      { name: "Mapping Done", value: vendorDoneRows.length },
      { name: "Mapping Pending", value: vendorPendingRows.length },
    ],
    [vendorDoneRows.length, vendorPendingRows.length]
  );

  /* ---- Shades ---- */
  const STATE_SHADE = "bg-purple-50 border-purple-200";
  const AA_SHADE = "bg-emerald-50 border-emerald-200";
  const DEMAND_SHADE = "bg-rose-50 border-rose-200";
  const VENDOR_SHADE = "bg-sky-50 border-sky-200";
  const VENDOR_SHADE_ALT = "bg-amber-50 border-amber-200";

  /* ---- View handlers ---- */
  const openView = (title: string, rows: any[]) => {
    setViewTitle(title);
    setViewRows(rows);
    setViewOpen(true);
  };

  return (
    <div className="p-5 space-y-5 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-800">IA Dashboard</h2>
        <p className="text-xs text-gray-500">Filters default to the current Financial Year ({CURRENT_FY}).</p>
      </div>

      {/* Filters */}
      <Card className="p-3 md:p-4 border border-gray-200 rounded-2xl bg-white">
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {/* FY */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Financial Year</label>
            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
              {["All", ...FY_OPTIONS].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Type */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Plan Type</label>
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm"
              value={planType}
              onChange={(e) => {
                setPlanType(e.target.value);
                // reset all chain filters
                setMLAName("All");
                setMlaSchemeId("All");
                setMlaWorkId("All");
                setMLCName("All");
                setMlcWorkType("All");
                setMlcWorkId("All");
                setTaluka("All");
                setHadpWorkId("All");
              }}
            >
              {["All", "MLA", "MLC", "HADP"].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* MLA chain */}
          {planType === "MLA" && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">IA District</label>
                <input className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" value={currentIADistrict || "-"} readOnly />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">MLA</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={mlaName} onChange={(e) => setMLAName(e.target.value)}>
                  {mlaList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Scheme (for MLA)</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={mlaSchemeId} onChange={(e) => setMlaSchemeId(e.target.value)}>
                  {mlaSchemeList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Work (under Scheme & MLA)</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={mlaWorkId} onChange={(e) => setMlaWorkId(e.target.value)}>
                  {mlaWorkList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* MLC chain */}
          {planType === "MLC" && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">MLC</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={mlcName} onChange={(e) => setMLCName(e.target.value)}>
                  {mlcList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Work Type</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={mlcWorkType} onChange={(e) => setMlcWorkType(e.target.value)}>
                  {["All", "NODAL", "NON-NODAL"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-xs text-gray-600 mb-1">Work (assigned to this IA)</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={mlcWorkId} onChange={(e) => setMlcWorkId(e.target.value)}>
                  {mlcWorkList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* HADP chain */}
          {planType === "HADP" && (
            <>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">IA District</label>
                <input className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50" value={currentIADistrict || "-"} readOnly />
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Taluka</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={taluka} onChange={(e) => setTaluka(e.target.value)}>
                  {talukaList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Work (in Taluka)</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={hadpWorkId} onChange={(e) => setHadpWorkId(e.target.value)}>
                  {hadpWorkList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* =================== SECTIONS LAYOUT =================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Mixed: State + AA */}
        <div className="md:col-span-6">
          <Section title="State" subtitle="Totals to and from State (₹)">
            <MetricCard i={0} title="Demanded to State" subtitle="Total Amount" value={fmtINR(stats.totalDemandedToState)} icon={<PieChart className="w-5 h-5 text-purple-600" />} shade={STATE_SHADE} />
            <MetricCard i={1} title="Received from State" subtitle="Total Amount" value={fmtINR(stats.totalReceivedFromState)} icon={<PieChart className="w-5 h-5 text-green-600" />} shade={STATE_SHADE} />
          </Section>
        </div>

        <div className="md:col-span-6">
          <Section title="AA (District Approved)" subtitle="Sanctioned works & amounts">
            <MetricCard
              i={0}
              title="AA Approved Works"
              subtitle="Count"
              value={stats.aaApprovedCount}
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              shade={AA_SHADE}
              onView={() => openView("AA Approved Works", aaApprovedRows)}
            />
            <MetricCard i={1} title="AA Approved Amount" subtitle="Total" value={fmtINR(stats.aaApprovedAmount)} icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} shade={AA_SHADE} />
          </Section>
        </div>

        {/* Demands + Vendor */}
        <div className="md:col-span-4">
          <Section title="Demands" subtitle="Exceptions & rejections">
            <MetricCard
              i={0}
              title="Rejected Demands"
              subtitle="Count"
              value={rejectedRows.length}
              icon={<XCircle className="w-5 h-5 text-rose-600" />}
              shade={DEMAND_SHADE}
              onView={() => openView("Rejected Demands", rejectedRows)}
            />
          </Section>
        </div>

        <div className="md:col-span-8">
          <Section title="Vendor Mapping" subtitle="Progress on mapping">
            <MetricCard
              i={0}
              title="Mapping Done"
              subtitle="Count"
              value={vendorDoneRows.length}
              icon={<Link2 className="w-5 h-5 text-sky-700" />}
              shade={VENDOR_SHADE}
              onView={() => openView("Vendor Mapping - Done", vendorDoneRows)}
            />
            <MetricCard i={1} title="Done Amount" subtitle="Total" value={fmtINR(stats.vendorDoneAmount)} icon={<TrendingUp className="w-5 h-5 text-sky-700" />} shade={VENDOR_SHADE} />
            <MetricCard
              i={2}
              title="Mapping Pending"
              subtitle="Count"
              value={vendorPendingRows.length}
              icon={<Link2 className="w-5 h-5 text-amber-700" />}
              shade={VENDOR_SHADE_ALT}
              onView={() => openView("Vendor Mapping - Pending", vendorPendingRows)}
            />
            <MetricCard i={3} title="Pending Amount" subtitle="Total" value={fmtINR(stats.vendorPendingAmount)} icon={<TrendingUp className="w-5 h-5 text-amber-700" />} shade={VENDOR_SHADE_ALT} />
          </Section>
        </div>
      </div>

      {/* =================== CHARTS =================== */}
      <div className="grid gap-4 md:grid-cols-12">
        <Card className="md:col-span-8 p-4 border border-gray-200 rounded-2xl bg-white">
          <div className="text-sm font-semibold text-gray-800 mb-2">Fund Demanded vs Received (by Financial Year)</div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byFY}>
                <XAxis dataKey="fy" />
                <YAxis tickFormatter={(v) => `₹${(v / 1_00_000).toFixed(0)}L`} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="demanded" name="Demanded to State" />
                <Bar dataKey="received" name="Received from State" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="md:col-span-4 p-4 border border-gray-200 rounded-2xl bg-white">
          <div className="text-sm font-semibold text-gray-800 mb-2">Vendor Mapping Status (Count)</div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie data={vendorPie} dataKey="value" nameKey="name" outerRadius={90} label={(e) => `${e.name}: ${e.value}`}>
                  {vendorPie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={["#10b981", "#f59e0b"][index % 2]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* =================== View Modal (table) =================== */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{viewTitle}</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  {["Sr No", "Work Title", "IA Name", "Plan Entity", "Demand Amount", "AA Amount", "Status", "Vendor Mapped"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {viewRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-sm text-gray-500 py-6">
                      No records.
                    </td>
                  </tr>
                ) : (
                  viewRows.map((r, i) => (
                    <tr key={r.id ?? i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm border-b">{i + 1}</td>
                      <td className="px-3 py-2 text-sm border-b">{getWorkName(r)}</td>
                      <td className="px-3 py-2 text-sm border-b">{getIAName(r) || "-"}</td>
                      <td className="px-3 py-2 text-sm border-b">
                        {planType === "MLA"
                          ? getMLAName(r) || "-"
                          : planType === "MLC"
                          ? `${getMLCName(r)} • ${getWorkType(r)}`
                          : planType === "HADP"
                          ? getTaluka(r) || "-"
                          : getMLAName(r) || getTaluka(r) || "-"}
                      </td>
                      <td className="px-3 py-2 text-sm border-b">{fmtINR(getDemandAmount(r))}</td>
                      <td className="px-3 py-2 text-sm border-b">{fmtINR(getAAAmount(r))}</td>
                      <td className="px-3 py-2 text-sm border-b">{r.status || r.demandStatus || "-"}</td>
                      <td className="px-3 py-2 text-sm border-b">{isVendorMapped(r) ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}