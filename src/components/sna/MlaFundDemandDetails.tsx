// src/components/MlaFundDemandDetails.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, FileText, Check, XCircle } from "lucide-react";

const remarksMap: Record<string, string> = {
  "प्रथम हप्ता": "First Installment",
  "पहिली मागणी": "Initial Request",
  "दुसरी मागणी": "Second Installment",
};

interface Demand {
  id: string;
  workId: number;
  amount: number;
  date: string;
  status: string; // "Approved" | "Pending"
  remarks: string;
}
interface Work {
  id: number;
  workCode: string;
  name: string;
  district: string;
  constituency: string;
  mlaName: string;
  financialYear: string; // e.g. "2024-25"
  adminApprovedAmount: number;
  workPortionAmount: number;
  taxDeductionAmount: number;
  vendor: { id: string; name: string; aadhar: string };
  // Optional sanctioned date if available
  sanctionedDate?: string;
}

const toCurrency = (n: number) => `₹${(n || 0).toLocaleString()}`;

const MlaFundDemandDetails = ({
  open,
  onClose,
  demand,
  work,
  demands = [],
}: {
  open: boolean;
  onClose: () => void;
  demand: Demand | null;
  work: Work | null;
  demands?: Demand[];
}) => {
  if (!open || !demand || !work) return null;

  // Derived values
  const workDemands = demands.filter((d) => d.workId === work.id);
  const grossTotal =
    (work.workPortionAmount ?? 0) + (work.taxDeductionAmount ?? 0);

  const totalDemanded = workDemands.reduce(
    (sum, d) => sum + (d.amount ?? 0),
    0
  );
  const totalDisbursed = workDemands
    .filter((d) => d.status === "Approved")
    .reduce((s, d) => s + d.amount, 0);

  // For right column: "Fund Demands in FY 2024-2025" -> previous demands (exclude current)
  const previousDemands = workDemands.filter((d) => d.id !== demand.id);
  const prevRows = previousDemands.map((d) => ({
    ...d,
    disbursed: d.status === "Approved" ? d.amount : 0,
  }));

  // Current demand + balance remaining section
  const estimatedBalanceAfterCurrent = Math.max(
    0,
    grossTotal - (totalDisbursed + demand.amount)
  );

  const remarkText = remarksMap[demand.remarks] || demand.remarks;
  const sanctionedDate = work.sanctionedDate || "—";

  const handleApprove = () => alert(`Approved ${demand.id}`);
  const handleReject = () => alert(`Rejected ${demand.id}`);

  return (
    <div
      className="
        bg-white rounded-2xl shadow-lg
        w-full max-w-[90vw] md:max-w-[1200px]
        max-h-[90vh] overflow-y-auto
        relative p-6
      "
    >
      {/* Close */}
      <button className="absolute top-4 right-4" onClick={onClose}>
        <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
      </button>

      {/* Title */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Fund Demand Details – <span className="text-gray-600">{work.workCode}</span>
        </h2>
        <p className="text-xs text-gray-500">Financial Year: {work.financialYear}</p>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* 1) Work & MLA Overview (with sanctioned date; removed balance) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Work & MLA Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">MLA/MLC Name</span>
                  <div>{work.mlaName}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">District</span>
                  <div>{work.district}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Constituency</span>
                  <div>{work.constituency}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Work Code</span>
                  <div>{work.workCode}</div>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-600">Work Title</span>
                  <div>{work.name}</div>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Financial Year</span>
                  <div>{work.financialYear}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Work Sanctioned Date</span>
                  <div>{sanctionedDate}</div>
                </div>

                <div>
                  <span className="font-medium text-gray-600">AA Amount</span>
                  <div>{toCurrency(work.adminApprovedAmount)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Gross Amount</span>
                  <div>{toCurrency(grossTotal)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total Demanded</span>
                  <div>{toCurrency(totalDemanded)}</div>
                </div>
                {/* Balance removed from here as requested */}
              </div>
            </CardContent>
          </Card>

          {/* 2) Vendor Details (below Work details) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Vendor Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Vendor ID</span>
                  <div>{work.vendor.id}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Vendor Name</span>
                  <div>{work.vendor.name}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Aadhar No.</span>
                  <div>xxxx-xxxx-{work.vendor.aadhar.slice(-4)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3) File Attachments (below Vendor details) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">File Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-blue-700 underline">
                  <FileText className="w-4 h-4" /> Work Order
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-blue-700 underline">
                  <FileText className="w-4 h-4" /> AA Order
                </a>
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-blue-700 underline">
                  <FileText className="w-4 h-4" /> Previous Releases
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* A) Fund Demands in FY 2024-2025 (previous demands list with disbursed calc) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fund Demands in FY 2024-2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 border text-left">Demand ID</th>
                      <th className="px-2 py-1 border text-left">Date</th>
                      <th className="px-2 py-1 border text-right">Demand Amount</th>
                      <th className="px-2 py-1 border text-right">Disbursed Amount</th>
                      <th className="px-2 py-1 border text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prevRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-gray-400 py-4"
                        >
                          No previous demands in this FY.
                        </td>
                      </tr>
                    ) : (
                      prevRows.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-2 py-1 border">{r.id}</td>
                          <td className="px-2 py-1 border">{r.date}</td>
                          <td className="px-2 py-1 border text-right">
                            {toCurrency(r.amount)}
                          </td>
                          <td className="px-2 py-1 border text-right">
                            {toCurrency(r.disbursed)}
                          </td>
                          <td className="px-2 py-1 border text-center">
                            <Badge>{r.status}</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* B) Current Demand Details + Balance remaining for this work */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Current Demand Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Demand ID</span>
                  <div>{demand.id}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Date</span>
                  <div>{demand.date}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Demand Amount</span>
                  <div>{toCurrency(demand.amount)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status</span>
                  <div>
                    <Badge>{demand.status}</Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-600">Remark</span>
                  <div>{remarkText}</div>
                </div>
              </div>

              {/* Balance remaining (after including this current demand amount) */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    Total Disbursed (Till Date)
                  </div>
                  <div className="text-lg font-bold text-emerald-900">
                    {toCurrency(totalDisbursed)}
                  </div>
                </div>
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                  <div className="text-[11px] text-amber-700 font-semibold">
                    Balance Remaining (After Current)
                  </div>
                  <div className="text-lg font-bold text-amber-900">
                    {toCurrency(estimatedBalanceAfterCurrent)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full-width: All Demands for this Work (unchanged) */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">All Demands for this Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 border text-left">Demand ID</th>
                  <th className="px-2 py-1 border text-left">Date</th>
                  <th className="px-2 py-1 border text-right">Amount</th>
                  <th className="px-2 py-1 border text-center">Status</th>
                  <th className="px-2 py-1 border text-left">Remark</th>
                </tr>
              </thead>
              <tbody>
                {workDemands.length > 0 ? (
                  workDemands.map((wd) => (
                    <tr
                      key={wd.id}
                      className={
                        wd.id === demand.id ? "bg-primary/10 font-semibold" : undefined
                      }
                    >
                      <td className="px-2 py-1 border">{wd.id}</td>
                      <td className="px-2 py-1 border">{wd.date}</td>
                      <td className="px-2 py-1 border text-right">
                        {toCurrency(wd.amount)}
                      </td>
                      <td className="px-2 py-1 border text-center">
                        <Badge>{wd.status}</Badge>
                      </td>
                      <td className="px-2 py-1 border">
                        {remarksMap[wd.remarks] || wd.remarks}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-4">
                      No demands
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="destructive" onClick={handleReject}>
          <XCircle className="w-4 h-4 mr-1" /> Reject
        </Button>
        <Button variant="default" onClick={handleApprove}>
          <Check className="w-4 h-4 mr-1" /> Approve
        </Button>
      </div>
    </div>
  );
};

export default MlaFundDemandDetails;
