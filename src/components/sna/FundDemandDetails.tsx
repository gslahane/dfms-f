import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Eye } from 'lucide-react';

const FundDemandDetails = ({ open, onClose, demand, work, vendor, demands = [] }: any) => {
  if (!open || !demand || !work) return null;

  // Calculate all demands for this work
  const workDemands = demands.filter((d: any) => d.workId === work.id);

  // Calculations
  const grossTotal = (work.workPortionAmount ?? 0) + (work.taxDeductionAmount ?? 0);
  const totalDemanded = workDemands.reduce((acc: number, d: any) => acc + (d.amount ?? 0), 0);
  const balanceAmount = grossTotal - totalDemanded;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Work & Scheme Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
              <div>
                <span className="font-medium text-gray-600">Scheme Name</span>
                <div>{work.scheme}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Work Name</span>
                <div>{work.name}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Sanctioned Date</span>
                <div>{work.sanctionedDate}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Financial Year</span>
                <div>{work.financialYear}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Work Portion Amount</span>
                <div>₹{(work.workPortionAmount ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Gross Total</span>
                <div>₹{(grossTotal ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Demanded</span>
                <div>₹{(totalDemanded ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Balance Amount</span>
                <div className="font-bold text-primary">₹{(balanceAmount ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">IA / PWD</span>
                <div>{work.ia || 'PWD'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Vendor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Vendor Name</span>
                <div>{vendor?.name || demand.vendor}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Aadhar No.</span>
                <div>{vendor?.aadhar}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Demand Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div><span className="font-medium text-gray-600">Demand ID</span><div>{demand.id}</div></div>
              <div><span className="font-medium text-gray-600">Date</span><div>{demand.date}</div></div>
              <div><span className="font-medium text-gray-600">Amount</span><div>₹{(demand.amount ?? 0).toLocaleString()}</div></div>
              <div><span className="font-medium text-gray-600">Net Payable</span><div>₹{(demand.netPayable ?? demand.amount ?? 0).toLocaleString()}</div></div>
              <div><span className="font-medium text-gray-600">Status</span><div><Badge>{demand.status}</Badge></div></div>
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Remarks</span>
                <div>{demand.remarks}</div>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-600">Taxes Applied:</span>
              <ul className="text-xs ml-3 mt-1">
                {(demand.taxes && demand.taxes.length > 0) ? (
                  demand.taxes.map((tax: any, idx: number) => (
                    <li key={idx}>
                      {tax.name}: ₹{(tax.amount ?? 0).toLocaleString()}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No taxes applied</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
        {/* All Demands Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">All Demands for this Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border">Demand ID</th>
                    <th className="px-2 py-1 border">Date</th>
                    <th className="px-2 py-1 border">Amount</th>
                    <th className="px-2 py-1 border">Net Payable</th>
                    <th className="px-2 py-1 border">Status</th>
                    <th className="px-2 py-1 border">Remarks</th>
                    <th className="px-2 py-1 border">Taxes</th>
                  </tr>
                </thead>
                <tbody>
                  {workDemands.map((d: any) => (
                    <tr
                      key={d.id}
                      className={d.id === demand.id ? "bg-primary/10 border font-semibold" : "border"}
                    >
                      <td className="px-2 py-1 border">{d.id}</td>
                      <td className="px-2 py-1 border">{d.date}</td>
                      <td className="px-2 py-1 border">₹{(d.amount ?? 0).toLocaleString()}</td>
                      <td className="px-2 py-1 border">₹{(d.netPayable ?? d.amount ?? 0).toLocaleString()}</td>
                      <td className="px-2 py-1 border">
                        <Badge>{d.status}</Badge>
                      </td>
                      <td className="px-2 py-1 border">{d.remarks}</td>
                      <td className="px-2 py-1 border">
                        {(d.taxes && d.taxes.length > 0)
                          ? d.taxes.map((tax: any, idx: number) =>
                              <div key={idx}>{tax.name}: ₹{(tax.amount ?? 0).toLocaleString()}</div>)
                          : <span className="text-gray-400">-</span>
                        }
                      </td>
                    </tr>
                  ))}
                  {workDemands.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 py-4">No Demands</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FundDemandDetails;
