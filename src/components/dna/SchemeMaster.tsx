// src/components/SchemeMaster.tsx
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, X } from "lucide-react";
import { initialSchemes } from "@/components/data/dapPayload"; // your JSON constant
interface Scheme {
  id: number;
  district_code: string;
  fy: string;
  planType: string;
  scheme_name: string;
  budget_allocated: number;
  crc_code: string;
  schemetype: "REVENUE" | "CAPITAL" | "DEBT";
}

export const SchemeMaster: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>(initialSchemes);

  // Filters
  const [fy, setFY] = useState("");
  const [planType, setPlanType] = useState("");
  const [district, setDistrict] = useState("");
  const [schemeType, setSchemeType] = useState("");

  // Dropdown options
  const financialYearOptions = ["2023-24", "2024-25", "2025-26"];
  const districtOptions = useMemo(
    () => Array.from(new Set(schemes.map(s => s.district_code))),
    [schemes]
  );
  const planTypeOptions = useMemo(
    () => Array.from(new Set(schemes.map(s => s.planType))),
    [schemes]
  );
  const schemeTypeOptions = useMemo(
    () => Array.from(new Set(schemes.map(s => s.schemetype))),
    [schemes]
  );

  // Filtered list
  const filtered = useMemo(() => {
    return schemes.filter(s => {
      if (fy && s.fy !== fy) return false;
      if (planType && s.planType !== planType) return false;
      if (district && s.district_code !== district) return false;
      if (schemeType && s.schemetype !== schemeType) return false;
      return true;
    });
  }, [schemes, fy, planType, district, schemeType]);

  // Handlers
  const removeScheme = (id: number) => {
    setSchemes(prev => prev.filter(s => s.id !== id));
  };
  const viewScheme = (id: number) => {
    // TODO: implement view-details modal
    alert(`View details for scheme #${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Card className="border-gray-200 border rounded-sm shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle className="text-xl font-semibold">Scheme Master</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <select
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
              value={fy}
              onChange={e => setFY(e.target.value)}
            >
              <option value="">All Years</option>
              {financialYearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
              value={planType}
              onChange={e => setPlanType(e.target.value)}
            >
              <option value="">All Plan Types</option>
              {planTypeOptions.map(pt => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
              value={district}
              onChange={e => setDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {districtOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm"
              value={schemeType}
              onChange={e => setSchemeType(e.target.value)}
            >
              <option value="">All Scheme Types</option>
              {schemeTypeOptions.map(st => (
                <option key={st} value={st}>
                  {st.charAt(0) + st.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
<div className="overflow-x-auto bg-white rounded-sm">
  <table className="min-w-full table-fixed border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-50">
        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
          Sr No
        </th>
        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
          Scheme
        </th>
        <th className="border border-gray-200 px-4 py-2 text-right text-sm font-medium text-gray-700">
          Budget
        </th>
        <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700">
          Type
        </th>
        <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((s, idx) => (
        <tr
          key={s.id}
          className="hover:bg-gray-50"
        >
          <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
            {idx + 1}
          </td>
          <td className="border border-gray-200 px-4 py-2 text-sm text-gray-800">
            <span className="font-medium">{s.crc_code}</span>{" "}
            {s.scheme_name}
          </td>
          <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600 text-right">
            ₹{s.budget_allocated.toLocaleString()}
          </td>
          <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600 text-center">
            <Badge
              variant={
                s.schemetype === "REVENUE"
                  ? "secondary"
                  : s.schemetype === "CAPITAL"
                  ? "default"
                  : "destructive"
              }
            >
              {s.schemetype.charAt(0) + s.schemetype.slice(1).toLowerCase()}
            </Badge>
          </td>
          <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600 text-center space-x-2">
            <button
              onClick={() => viewScheme(s.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Eye className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => removeScheme(s.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
          </td>
        </tr>
      ))}
      {filtered.length === 0 && (
        <tr>
          <td
            colSpan={5}
            className="border border-gray-200 px-4 py-6 text-center text-gray-400"
          >
            No schemes found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemeMaster;
