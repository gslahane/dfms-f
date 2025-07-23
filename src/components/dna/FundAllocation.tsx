import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { dapPayload } from "@/components/data/dapPayload";

export default function SchemeBudgetAllocation() {
  // ✅ Safe access to dapPayload.data
  const allSchemes = useMemo(() => {
    if (!dapPayload?.data) return [];

    return dapPayload.data.flatMap(entry =>
      entry.schemes?.map(s => ({
        ...s,
        parentDemand: entry.demandNumber,
        budget: s.budgetThousands, // in thousands
      })) || []
    );
  }, []);

  const [fy, setFy] = useState<string>(dapPayload.financialYear || "");
  const [planType, setPlanType] = useState<string>(dapPayload.planType || "");
  const [demandCode, setDemandCode] = useState<string>("All");
  const [schemeName, setSchemeName] = useState<string>("All");

  const fyOptions = useMemo(() => [dapPayload.financialYear], []);
  const planOptions = useMemo(() => [dapPayload.planType], []);
  const demandOptions = useMemo(
    () => ["All", ...new Set(allSchemes.map(s => s.demandCode))],
    [allSchemes]
  );
  const schemeOptions = useMemo(
    () => ["All", ...new Set(allSchemes.map(s => s.schemeTitle))],
    [allSchemes]
  );

  const filtered = useMemo(
    () =>
      allSchemes.filter(s =>
        (demandCode === "All" || s.demandCode === demandCode) &&
        (schemeName === "All" || s.schemeTitle === schemeName)
      ),
    [allSchemes, demandCode, schemeName]
  );

  const totalBudget = useMemo(
    () => allSchemes.reduce((sum, s) => sum + s.budget, 0),
    [allSchemes]
  );
  const totalRevenue = useMemo(
    () => allSchemes.filter(s => s.demandCode?.includes("Revenue")).reduce((sum, s) => sum + s.budget, 0),
    [allSchemes]
  );
  const totalCapital = useMemo(
    () => allSchemes.filter(s => s.demandCode?.includes("Capital")).reduce((sum, s) => sum + s.budget, 0),
    [allSchemes]
  );

  const assignBudget = (id: string) => console.log(`Assign budget for scheme ${id}`);

  const stats = [
    { label: "Total Budget", value: totalBudget, color: "blue" },
    { label: "Total Revenue", value: totalRevenue, color: "green" },
    { label: "Total Capital", value: totalCapital, color: "purple" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div key={s.label} className={`flex border-l-4 p-4 bg-white rounded-lg shadow-sm border-t-2 border-${s.color}-500`} style={{ borderTopWidth: '4px' }}>
            <div className="flex-1">
              <div className={`text-xs font-semibold text-${s.color}-700`}>{s.label}</div>
              <div className="mt-1 text-2xl font-bold text-gray-800">₹{s.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{((s.value / totalBudget) * 100).toFixed(1)}% of total</div>
            </div>
            <div className={`flex items-center justify-center w-10 h-10 bg-${s.color}-100 rounded-full`}>
              <span className={`text-${s.color}-500 text-lg`}>■</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 italic">* Amounts are in thousands</div>

      {/* Filters */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Financial Year', value: fy, setter: setFy, options: fyOptions },
            { label: 'Plan Type', value: planType, setter: setPlanType, options: planOptions },
            { label: 'Demand Code', value: demandCode, setter: setDemandCode, options: demandOptions },
            { label: 'Scheme Name', value: schemeName, setter: setSchemeName, options: schemeOptions }
          ].map((f, idx) => (
            <div key={f.label} className="flex flex-col">
              <div className="text-xs text-gray-600 mb-1">{f.label}</div>
              <Select value={f.value} onValueChange={f.setter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder={`Select ${f.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((opt, i) =>
                    opt ? (
                      <SelectItem key={`${opt}-${i}`} value={opt}>
                        {opt}
                      </SelectItem>
                    ) : null
                  )}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow border border-gray-200">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-8 px-3 py-2">#</TableHead>
              <TableHead className="px-4 py-2">Scheme Name</TableHead>
                <TableHead className="px-4 py-2">Annual Budget</TableHead>
              <TableHead className="px-4 py-2">Revised Budget</TableHead>
              <TableHead className="w-48 px-4 py-2 text-right">Balance Amount</TableHead>
              <TableHead className="w-32 px-4 py-2 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(filtered) && filtered.length > 0 ? (
              filtered.map((s, idx) => (
                <TableRow key={s.schemeCRC || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <TableCell className="border px-3 py-2 text-sm">{idx + 1}</TableCell>
                  <TableCell className="border px-4 py-2 text-sm font-medium">
                    {s.schemeCRC} {s.schemeTitle}
                    
                  </TableCell>
                  <TableCell className="border px-4 py-2 text-sm text-right">
                    ₹{s.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-4 py-2 text-sm text-right">
                    ₹{s.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-4 py-2 text-sm text-right">
                    ₹{s.budget.toLocaleString()}
                  </TableCell>
                  <TableCell className="border px-4 py-2 text-center">
                    <Button size="sm" onClick={() => assignBudget(s.schemeCRC)}>
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="border py-6 text-center text-gray-500">
                  No schemes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-red-500 italic">* Amounts are in thousands</div>
    </div>
  );
}
