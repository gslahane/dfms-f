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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
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

import { dapPayload } from "@/components/data/dapPayload";
import { hadpMock } from "@/components/data/mlaData";

// Mock for MLA/MLC plan (your data should be imported)
const mlaMlcData = {
  financialYear: "2025-2026",
  planType: "ML",
  data: [
    { district: "PUNE", taluka: "Pimpri", type: "MLA", term: 15, name: "Anna Dadu Bansode", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 20000 },
    { district: "PUNE", taluka: "Baramati", type: "MLA", term: 14, name: "Ajit Anantrao Pawar", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 50000, pendingDemands: 10000 },
    // ...rest of your data...
  ]
};

const Dashboard: React.FC = () => {
  // Financial Year & Plan Type
  const year = parseInt(dapPayload.financialYear, 10);
  const currentFy = `${year}-${year + 1}`;
  const [fy, setFy] = useState<string>(currentFy);
  const [planType, setPlanType] = useState<"DAP" | "ML" | "HADP">("DAP");

  // DAP
  const [district, setDistrict] = useState<string>("All");
  const [demand, setDemand] = useState<string>("All");

  // MLA
  const [mlaDistrict, setMlaDistrict] = useState<string>("All");
  const [mlaName, setMlaName] = useState<string>("All");

  // HADP
  const [hadpTaluka, setHadpTaluka] = useState<string>("All");

  // Misc
  const [detailKey, setDetailKey] = useState<string | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState<boolean>(false);

  // Reset all filters on plan change
  useEffect(() => {
    setDistrict("All");
    setDemand("All");
    setMlaDistrict("All");
    setMlaName("All");
    setHadpTaluka("All");
    setDetailKey(null);
    setShowPendingOnly(false);
  }, [planType]);

  // Reset demand when district changes
  useEffect(() => { setDemand("All"); setShowPendingOnly(false); }, [district]);
  useEffect(() => { setMlaName("All"); setShowPendingOnly(false); }, [mlaDistrict]);

  // Dropdown Options
  const fyOptions = useMemo(() => ["All", currentFy], [currentFy]);
  const planOptions = ["DAP", "ML", "HADP"] as const;
  const districtOptions = useMemo(
    () => ["All", ...new Set(dapPayload.data.map(d => d.district))],
    []
  );
  const demandOptions = useMemo(() => {
    const arr = dapPayload.data
      .filter(d => district === "All" || d.district === district)
      .map(d => d.demandNumber);
    return ["All", ...new Set(arr)];
  }, [district]);
  const mlaDistrictOptions = useMemo(
    () => ["All", ...new Set(mlaMlcData.data.map(d => d.district))],
    []
  );
  const mlaNameOptions = useMemo(() => {
    const arr = mlaMlcData.data
      .filter(d => mlaDistrict === "All" || d.district === mlaDistrict)
      .map(d => d.name);
    return ["All", ...new Set(arr)];
  }, [mlaDistrict]);
  const hadpTalukaOptions = useMemo(
    () => ["All", ...Array.from(new Set(hadpMock.map(d => d.taluka)))],
    []
  );

  // Filtered DAP rows
  const rowsDAP = useMemo(() =>
    dapPayload.data
      .filter(d =>
        (fy === "All" || `${dapPayload.financialYear}-${+dapPayload.financialYear + 1}` === fy) &&
        (district === "All" || d.district === district) &&
        (demand === "All" || d.demandNumber === demand) &&
        (!showPendingOnly || d.demandsPendingForApproval > 0)
      )
      .map(d => ({ ...d, key: `${d.demandNumber}|${d.district}` }))
  , [fy, district, demand, showPendingOnly]);

  // Filtered MLA/MLC rows
  const rowsMLRaw = useMemo(() =>
    mlaMlcData.data
      .filter(d => mlaDistrict === "All" || d.district === mlaDistrict)
      .filter(d => mlaName === "All" || d.name === mlaName)
      .filter(d => !showPendingOnly || d.pendingDemands > 0)
  , [mlaDistrict, mlaName, showPendingOnly]);

  // HADP rows: filtered by taluka, sorted with pending at end
  const rowsH = useMemo(() => {
    const map: Record<string, { budget: number; utilized: number; pendingDemands: number, balance: number, taluka?: string }> = {};
    hadpMock.forEach(r => {
      if (hadpTaluka !== "All" && r.taluka !== hadpTaluka) return;
      if (!map[r.demandCode])
        map[r.demandCode] = { budget: 0, utilized: 0, pendingDemands: 0, balance: 0, taluka: r.taluka };
      map[r.demandCode].budget += r.demandAmount;
      if (r.status === "Approved") map[r.demandCode].utilized += r.demandAmount;
      else {
        map[r.demandCode].balance += r.demandAmount;
        map[r.demandCode].pendingDemands += r.demandAmount;
      }
      map[r.demandCode].taluka = r.taluka;
    });
    let arr = Object.entries(map).map(([code, v]) => ({ key: code, demandCode: code, ...v }));
    // Pending at last
    arr.sort((a, b) => {
      if ((a.balance > 0 && b.balance === 0)) return 1;
      if ((a.balance === 0 && b.balance > 0)) return -1;
      return 0;
    });
    return arr.filter(r => !showPendingOnly || r.balance > 0);
  }, [showPendingOnly, hadpTaluka]);

  // Metrics helpers
  const toK = (v: number) => (v / 1).toFixed(1);
  const pct = (p: number, t: number) => (t > 0 ? `${((p / t) * 100).toFixed(1)}%` : "0%");

  // DAP totals
  const totalBudget   = rowsDAP.reduce((s, r) => s + r.budget, 0);
  const totalDist     = rowsDAP.reduce((s, r) => s + r.fundsDistributed, 0);
  const totalPend     = rowsDAP.reduce((s, r) => s + r.demandsPendingForApproval, 0);
  const totalBal      = rowsDAP.reduce((s, r) => s + r.balanceBudget, 0);
  const allDAP        = dapPayload.data.reduce((s, r) => s + r.budget, 0);
  const allML         = mlaMlcData.data.reduce((s, r) => s + r.budget, 0);
  const allHD         = hadpMock.reduce((s, r) => s + r.demandAmount, 0);

  // DAP footer
  const footerDAP = useMemo(() =>
    rowsDAP.reduce((a, r) => {
      a.budget += r.budget;
      a.distributed += r.fundsDistributed;
      a.pending += r.demandsPendingForApproval;
      a.balance += r.balanceBudget;
      return a;
    }, { budget: 0, distributed: 0, pending: 0, balance: 0 }),
    [rowsDAP]
  );

  // MLA footer
  const footerMLRaw = useMemo(() =>
    rowsMLRaw.reduce((a, r) => {
      a.budget += r.budget;
      a.utilized += r.fundUtilized;
      a.pendingDemands += r.pendingDemands;
      a.balance += r.balance;
      return a;
    }, { budget: 0, utilized: 0, pendingDemands: 0, balance: 0 }),
    [rowsMLRaw]
  );

  // HADP footer
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

  // DAP detail drill-in
  if (detailKey) {
    const [dn] = detailKey.split("|");
    const rec = rowsDAP.find(r => r.key === detailKey)!;
    const schemes = rec.schemes || [];
    const footerDetail = schemes.reduce((a, s) => {
      a.budget += s.budgetThousands;
      return a;
    }, { budget: 0 });
    return (
      <div className="p-4 space-y-4">
        <Button variant="outline" onClick={() => setDetailKey(null)}>← Back</Button>
        <h2 className="text-lg font-semibold">Schemes under {dn}</h2>
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-300">
            <TableHeader>
              <TableRow>
                <TableHead className="border px-2 py-1">Sr No</TableHead>
                <TableHead className="border px-2 py-1">Scheme Name</TableHead>
                <TableHead className="border px-2 py-1 text-right">Budget </TableHead>
                <TableHead className="border px-2 py-1 text-right">Pending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="border px-2 py-1 text-xs">{i + 1}</TableCell>
                  <TableCell className="border px-2 py-1 text-xs">
                    {`${s.schemeCRC} (${s.objectCode}) ${s.schemeTitle}`}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right text-xs">
                    {s.budgetThousands.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right text-xs">—</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="border px-2 py-1 font-semibold text-xs">
                  Total
                </TableCell>
                <TableCell className="border px-2 py-1 text-right font-semibold text-xs">
                  {footerDetail.budget.toLocaleString()}
                </TableCell>
                <TableCell className="border px-2 py-1 text-right font-semibold text-xs">—</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    );
  }

  // === Main Dashboard ===
  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="flex-1 min-w-[140px]">
          <Label htmlFor="fy">Financial Year</Label>
          <Select id="fy" value={fy} onValueChange={setFy}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {fyOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <Label htmlFor="plan">Plan Type</Label>
          <Select id="plan" value={planType} onValueChange={setPlanType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {planOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {planType === "DAP" && (
          <>
            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="district">District</Label>
              <Select id="district" value={district} onValueChange={setDistrict}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {districtOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <Label htmlFor="demand">Demand Number</Label>
              <Select id="demand" value={demand} onValueChange={setDemand}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {demandOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {planType === "ML" && (
          <>
            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="mladist">District</Label>
              <Select id="mladist" value={mlaDistrict} onValueChange={setMlaDistrict}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mlaDistrictOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <Label htmlFor="mlaname">MLA/MLC Account name </Label>
              <Select id="mlaname" value={mlaName} onValueChange={setMlaName}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mlaNameOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {/* HADP Taluka Filter */}
        {planType === "HADP" && (
          <div className="flex-1 min-w-[160px]">
            <Label htmlFor="hadp-taluka">Taluka</Label>
            <Select id="hadp-taluka" value={hadpTaluka} onValueChange={setHadpTaluka}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {hadpTalukaOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-6 gap-3">
        <motion.div
          className="col-span-6 sm:col-span-3 lg:col-span-2 border-l-4 border-purple-600 bg-white p-3 rounded-md shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold text-purple-600 uppercase">Overview</p>
          <div className="mt-1 text-xs space-y-0.5">
            {[
              { label: "District Annual Plan:", val: allDAP },
              { label: "ML", val: allML },
              { label: "HADP", val: allHD }
            ].map((b, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex justify-between">
                  <span>{b.label}</span>
                  <span>₹{toK(b.val)}</span>
                </div>
                <div className="flex justify-end">
                  <small className="text-gray-500">{pct(b.val, allDAP + allML + allHD)}</small>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        {(
          planType === "DAP"
            ? [
                { title: "Total Budget ", value: totalBudget, whole: allDAP, color: "blue" },
                { title: "Funds Distributed", value: totalDist, whole: totalBudget, color: "green" },
                { title: "Remaining Balance", value: totalBal, whole: totalBudget, color: "red" },
                { title: "Pending Demand Amount ", value: totalPend, whole: totalBudget, color: "yellow" }
              ]
            : planType === "ML"
            ? [
                { title: "Total Budget", value: footerMLRaw.budget, whole: footerMLRaw.budget, color: "green" },
                { title: "Disbursed Amount", value: footerMLRaw.utilized, whole: footerMLRaw.budget, color: "yellow" },
                { title: "Balance Amount", value: footerMLRaw.balance, whole: footerMLRaw.budget, color: "red" },
                { title: "Pending Demands", value: rowsMLRaw.reduce((s,r)=>s+r.pendingDemands,0), whole: footerMLRaw.budget, color: "orange" }
              ]
            : [
                { title: "Budget", value: footerH.budget, whole: footerH.budget, color: "blue" },
                { title: "Approved", value: footerH.utilized, whole: footerH.budget, color: "green" },
                { title: "Pending", value: footerH.balance, whole: footerH.budget, color: "yellow" },
                { title: "Balance", value: footerH.balance, whole: footerH.budget, color: "red" }
              ]
        ).map((c, i) => (
          <motion.div
            key={i}
            className={`col-span-6 sm:col-span-3 lg:col-span-1 border-l-4 border-${c.color}-500 bg-${c.color}-50 p-2 rounded-md shadow-sm cursor-pointer`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              if (["Pending", "Pending Demands"].includes(c.title)) {
                setShowPendingOnly(x => !x);
              } else {
                setShowPendingOnly(false);
              }
            }}
          >
            <p className={`text-xs font-semibold text-${c.color}-700`}>{c.title}</p>
            <p className={`mt-1 text-lg font-bold text-${c.color}-900`}>
              {["Pending", "Pending Demands", "Total Entries"].includes(c.title)
                ? c.value
                : `₹${toK(c.value)}`}
            </p>
            <div className="flex justify-end">
              <small className={`text-${c.color}-700 opacity-80`}>{pct(c.value, c.whole)}</small>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DAP Table */}
      {planType === "DAP" && (
        <Card className="rounded-md shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-sm">Demand Summary</CardTitle>
          <div className="flex gap-2 text-right">
            <span className="text-[10px] text-red-500">*Balance = Budget Amount- Fund Distributed |</span>
            <span className="text-[10px] text-red-500">*Amounts In Thousand</span>
          </div>
        </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                <TableRow>
                  <TableHead className="border px-2 py-1">S.No</TableHead>
                  <TableHead className="border px-2 py-1">Demand No.</TableHead>
                  <TableHead className="border px-2 py-1">District</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Budget </TableHead>
                  <TableHead className="border px-2 py-1 text-right">Funds Disbursed </TableHead>
                  <TableHead className="border px-2 py-1 text-right">Pending demand Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Balance </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsDAP.map((r, idx) => (
                  <TableRow key={r.key}>
                    <TableCell className="border px-2 py-1 text-xs">{idx + 1}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">
                      <Button variant="link" onClick={() => setDetailKey(r.key)}>
                        {r.demandNumber}
                      </Button>
                    </TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.district}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.budget)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.fundsDistributed)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{r.demandsPendingForApproval}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.balanceBudget)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="border px-2 py-1 font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerDAP.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerDAP.distributed.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerDAP.pending.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerDAP.balance.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MLA/MLC Table */}
      {planType === "ML" && (
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">
              MLA/MLC Details
              <div className="flex gap-2 text-right">
                <span className="text-[10px] text-red-500">*Balance = Budget Amount- Fund Distributed |</span>
                <span className="text-[10px] text-red-500">*Amounts In Thousand</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                <TableRow>
                  <TableHead className="border px-2 py-1">S.No</TableHead>
                  <TableHead className="border px-2 py-1">MLA/MLC Name</TableHead>
                  <TableHead className="border px-2 py-1">Assembly Constituency</TableHead>
                  <TableHead className="border px-2 py-1">Term</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Annual Budget Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Funds Disbursed </TableHead>
                  <TableHead className="border px-2 py-1 text-right">Balance Amount </TableHead>
                  <TableHead className="border px-2 py-1 text-right">Pending demands </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsMLRaw.map((r, idx) => (
                  <TableRow key={`${r.name}|${idx}`}>
                    <TableCell className="border px-2 py-1 text-xs">{idx + 1}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.name}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.taluka}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.term}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.budget)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.fundUtilized)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.balance)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.pendingDemands)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="border px-2 py-1 font-semibold">Total</TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLRaw.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLRaw.utilized.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerMLRaw.balance.toLocaleString()}
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
            <CardTitle className="text-sm">HADP Summary</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                <TableRow>
                  <TableHead className="border px-2 py-1">S.No</TableHead>
                  <TableHead className="border px-2 py-1">Demand Code</TableHead>
                  <TableHead className="border px-2 py-1">Taluka</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Budget Amount </TableHead>
                  <TableHead className="border px-2 py-1 text-right">Disbursed Amount</TableHead>
                  <TableHead className="border px-2 py-1 text-right">Remaning Balance </TableHead>
                  <TableHead className="border px-2 py-1 text-right">Pending Demand Amount </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsH.map((r, idx) => (
                  <TableRow key={r.key}>
                    <TableCell className="border px-2 py-1 text-xs">{idx + 1}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.demandCode}</TableCell>
                    <TableCell className="border px-2 py-1 text-xs">{r.taluka}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.budget)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.pendingDemands)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.utilized)}</TableCell>
                    <TableCell className="border px-2 py-1 text-right">{toK(r.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="border px-2 py-1 font-semibold">Total</TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.utilized.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.pendingDemands.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-2 py-1 text-right font-semibold">
                    {footerH.balance.toLocaleString()}
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
