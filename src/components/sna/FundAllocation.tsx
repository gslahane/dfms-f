// src/components/sna/BudgetAllocation.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { dapPayload } from "@/components/data/dapPayload";
import { hadpMock } from "@/components/data/mlaData";

// Helper for unique values
const uniq = (arr: any[]) => Array.from(new Set(arr));

// Demo MLA/MLC data
const mlaData = [
  // ... your MLA/MLC data as before ...
];

const financialYearOptions = ["All", "2023-24", "2024-25", "2025-26"];

type PlanType = "DAP" | "MLA/MLC" | "HADP";

interface Allocation {
  id: string;
  planType: PlanType;
  financialYear: string;
  district: string;
  taluka?: string;
  code: string;             // DAP: demandNumber, HADP: (not used), MLA/MLC: name
  allocatedAmount: number;  // in rupees
  date: string;
}

const BudgetAllocation: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];

  // Filters
  const [planType, setPlanType] = useState<PlanType>("DAP");
  const [selectedFY, setSelectedFY] = useState("All");
  const [district, setDistrict] = useState("All");
  const [taluka, setTaluka] = useState("All"); // HADP only
  const [code, setCode] = useState("All");
  const [allocation, setAllocation] = useState("");
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  // Reset filters on planType change
  useEffect(() => {
    setDistrict("All");
    setTaluka("All");
    setCode("All");
    setSelectedFY("All");
    setAllocation("");
  }, [planType]);

  // DAP options
  const dapDistricts = useMemo(
    () => ["All", ...uniq(dapPayload.data.map(d => d.district?.toUpperCase()).filter(Boolean))],
    []
  );
  const dapDemands = useMemo(() => {
    if (planType !== "DAP") return ["All"];
    const filtered = dapPayload.data.filter(
      d => district === "All" || d.district?.toUpperCase() === district
    );
    return ["All", ...uniq(filtered.map(d => d.demandNumber).filter(Boolean))];
  }, [planType, district]);

  // MLA/MLC options
  const mlaDistricts = useMemo(
    () => ["All", ...uniq(mlaData.map(r => r.district?.toUpperCase()).filter(Boolean))],
    []
  );
  const mlaNames = useMemo(() => {
    const filtered = mlaData.filter(
      r => district === "All" || r.district?.toUpperCase() === district
    );
    return ["All", ...uniq(filtered.map(r => r.name).filter(Boolean))];
  }, [district]);

  // HADP dropdowns — ALL FILTERED FOR NON-EMPTY VALUES!
  const hadpDistricts = useMemo(
    () => ["All", ...uniq(hadpMock.map(r => r.districtName?.toUpperCase()).filter(Boolean))],
    []
  );
  const hadpTalukas = useMemo(() => {
    const filtered = hadpMock.filter(
      r => district === "All" || r.districtName?.toUpperCase() === district
    );
    return ["All", ...uniq(filtered.map(r => r.talukaName?.toUpperCase()).filter(Boolean))];
  }, [district]);

  // Filter allocations for table display
  const filteredAllocs = useMemo(
    () =>
      allocations.filter(a => {
        if (a.planType !== planType) return false;
        if (selectedFY !== "All" && a.financialYear !== selectedFY) return false;
        if (district !== "All" && a.district !== district) return false;
        if (planType === "HADP" && taluka !== "All" && a.taluka !== taluka) return false;
        if (planType !== "HADP" && code !== "All" && a.code !== code) return false;
        return true;
      }),
    [allocations, planType, selectedFY, district, taluka, code]
  );

  // Allocate handler
  const handleAllocate = () => {
    if (
      selectedFY === "All" ||
      district === "All" ||
      (planType === "HADP" && taluka === "All") ||
      (planType !== "HADP" && code === "All") ||
      !allocation
    ) {
      return;
    }
    const amt = parseFloat(allocation) * 1000; // assume entered value is thousands
    setAllocations(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        planType,
        financialYear: selectedFY,
        district,
        taluka: planType === "HADP" ? taluka : undefined,
        code,
        allocatedAmount: amt,
        date: today,
      },
    ]);
    setAllocation("");
  };

  // Table header config
  const getHeaders = () => {
    if (planType === "MLA/MLC")
      return [
        "S.No",
        "FY",
        "District",
        "Taluka",
        "MLA/MLC Name",
        "Annual Budget",
        "Balance",
      ];
    if (planType === "HADP")
      return [
        "S.No",
        "District",
        "Taluka",
        "Allocated",
        "Balance",
      ];
    // DAP
    return [
      "S.No",
      "District",
      "Plan",
      "Demand No.",
      "Allocated",
      "Balance",
    ];
  };

  // Table data config
  const getTableRows = () => {
    if (planType === "MLA/MLC") {
      return mlaData
        .filter(r => district === "All" || r.district?.toUpperCase() === district)
        .filter(r => code === "All" || r.name === code)
        .map((d, idx) => (
          <TableRow key={d.name + idx}>
            <TableCell className="border px-2 py-1 text-xs">{idx + 1}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">2024-25</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{d.district}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{d.taluka}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{d.name}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{d.budget}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{d.balance}</TableCell>
          </TableRow>
        ));
    }
    if (planType === "HADP") {
      return filteredAllocs.length === 0 ? (
        <TableRow>
          <TableCell colSpan={getHeaders().length} className="text-center py-4 text-sm">
            No allocations yet.
          </TableCell>
        </TableRow>
      ) : (
        filteredAllocs.map((a, i) => {
          // Find balance
          const src = hadpMock.find(
            r =>
              (district === "All" || r.districtName?.toUpperCase() === district) &&
              (taluka === "All" || r.talukaName?.toUpperCase() === taluka)
          );
          const bal = src?.balanceBudget?.toLocaleString() || "-";
          return (
            <TableRow key={a.id}>
              <TableCell className="border px-2 py-1 text-xs">{i + 1}</TableCell>
              <TableCell className="border px-2 py-1 text-xs">{a.district}</TableCell>
              <TableCell className="border px-2 py-1 text-xs">{a.taluka}</TableCell>
              <TableCell className="border px-2 py-1 text-xs">
                ₹{a.allocatedAmount.toLocaleString()}
              </TableCell>
              <TableCell className="border px-2 py-1 text-xs">{bal}</TableCell>
            </TableRow>
          );
        })
      );
    }
    // DAP
    return filteredAllocs.length === 0 ? (
      <TableRow>
        <TableCell colSpan={getHeaders().length} className="text-center py-4 text-sm">
          No allocations yet.
        </TableCell>
      </TableRow>
    ) : (
      filteredAllocs.map((a, i) => {
        const src = dapPayload.data.find(d => d.demandNumber === a.code);
        const bal = src?.balanceBudget?.toLocaleString() || "-";
        return (
          <TableRow key={a.id}>
            <TableCell className="border px-2 py-1 text-xs">{i + 1}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{a.district}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{a.planType}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">{a.code}</TableCell>
            <TableCell className="border px-2 py-1 text-xs">
              ₹{a.allocatedAmount.toLocaleString()}
            </TableCell>
            <TableCell className="border px-2 py-1 text-xs">{bal}</TableCell>
          </TableRow>
        );
      })
    );
  };

  // --- RENDER ---
  return (
    <div className="p-4 space-y-6">
      {/* Filters + Allocate */}
      <div className="flex flex-wrap gap-4">
        {/* Plan Type */}
        <div className="flex-1 min-w-[140px]">
          <Label htmlFor="plan">Plan Type</Label>
          <Select
            id="plan"
            value={planType}
            onValueChange={v => setPlanType(v as PlanType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["DAP", "MLA/MLC", "HADP"].map(pt => (
                <SelectItem key={pt} value={pt}>{pt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Financial Year */}
        <div className="flex-1 min-w-[140px]">
          <Label htmlFor="fy">Financial Year</Label>
          <Select
            id="fy"
            value={selectedFY}
            onValueChange={setSelectedFY}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {financialYearOptions.map(fy => (
                <SelectItem key={fy} value={fy}>{fy}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* DAP: District + Demand No */}
        {planType === "DAP" && (
          <>
            <div className="flex-1 min-w-[140px]">
              <Label>District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {dapDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <Label>Demand No.</Label>
              <Select value={code} onValueChange={setCode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {dapDemands.map(dn => <SelectItem key={dn} value={dn}>{dn}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* MLA/MLC: District + Name */}
        {planType === "MLA/MLC" && (
          <>
            <div className="flex-1 min-w-[140px]">
              <Label>District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mlaDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label>MLA/MLC Name</Label>
              <Select value={code} onValueChange={setCode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mlaNames.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* HADP: District + Taluka only */}
        {planType === "HADP" && (
          <>
            <div className="flex-1 min-w-[140px]">
              <Label>District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {hadpDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <Label>Taluka</Label>
              <Select value={taluka} onValueChange={setTaluka}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {hadpTalukas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Amount */}
        <div className="flex-1 min-w-[140px]">
          <Label htmlFor="alloc">Amount (₹ Thousands)</Label>
          <Input
            id="alloc"
            type="number"
            placeholder="e.g. 1500"
            value={allocation}
            onChange={e => setAllocation(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAllocate}>Allocate Budget</Button>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-sm rounded-md">
        <CardHeader className="border-b pb-2">
          <CardTitle className="text-lg font-semibold">
            Budget Allocations
            <span className="text-sm text-red-600 italic ml-2">
              (*All Amounts Are in Thousands)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                {getHeaders().map(h => (
                  <TableHead
                    key={h}
                    className="border px-2 py-1 text-xs font-medium"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getTableRows()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetAllocation;
