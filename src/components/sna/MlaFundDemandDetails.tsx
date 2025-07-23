import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  X,
  FileText,
  Check,
  XCircle,
  CornerUpLeft
} from 'lucide-react';

const remarksMap: Record<string, string> = {
  'प्रथम हप्ता': 'First Installment',
  'पहिली मागणी': 'Initial Request',
  'दुसरी मागणी': 'Second Installment',
};

interface Demand {
  id: string;
  workId: number;
  amount: number;
  date: string;
  status: string;
  remarks: string;
}
interface Work {
  id: number;
  workCode: string;
  name: string;
  district: string;
  constituency: string;
  mlaName: string;
  financialYear: string;
  adminApprovedAmount: number;
  workPortionAmount: number;
  taxDeductionAmount: number;
  vendor: { id: string; name: string; aadhar: string };
}

const MlaFundDemandDetails = ({
  open,
  onClose,
  demand,
  work,
  demands = []
}: {
  open: boolean;
  onClose: () => void;
  demand: Demand | null;
  work: Work | null;
  demands?: Demand[];
}) => {
  if (!open || !demand || !work) return null;

  const workDemands = demands.filter(d => d.workId === work.id);
  const grossTotal = (work.workPortionAmount ?? 0) + (work.taxDeductionAmount ?? 0);
  const totalDemanded = workDemands.reduce((sum, d) => sum + (d.amount ?? 0), 0);
  const balanceAmount = grossTotal - totalDemanded;
  const remarkText = remarksMap[demand.remarks] || demand.remarks;

  const handleApprove = () => alert(`Approved ${demand.id}`);
  const handleReject  = () => alert(`Rejected ${demand.id}`);
  const handleSendBack = () => alert(`Sent Back ${demand.id}`);

  return (
    <div
      className="
        bg-white rounded-2xl shadow-lg
        w-full max-w-[90vw] md:max-w-[1100px]
        max-h-[90vh] overflow-y-auto
        relative p-6
      "
    >
      {/* close button */}
      <button
        className="absolute top-4 right-4"
        onClick={onClose}
      >
        <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
      </button>

      {/** 2×2 Grid for the first four cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 1: Work & MLA Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Work & MLA Overview</CardTitle>
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
                <span className="font-medium text-gray-600">AA Amount</span>
                <div>₹{work.adminApprovedAmount.toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Gross Amt</span>
                <div>₹{grossTotal.toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Demanded</span>
                <div>₹{totalDemanded.toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Balance Amount</span>
                <div className="font-bold">₹{balanceAmount.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
          <Card>
          <CardHeader>
            <CardTitle className="text-base">File Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" /> Work Order
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" /> AA Order
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" /> Previous Releases
              </div>
            </div>
          </CardContent>
        </Card>
        </Card>

        {/* 2: File Attachments */}
        

        {/* 3: Vendor Details */}
        <Card>
         <div>
             <CardHeader>
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
         </div>
                 <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Demand Details</CardTitle>
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
                <div>₹{demand.amount.toLocaleString()}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status</span>
                <div><Badge>{demand.status}</Badge></div>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-600">Remark</span>
                <div>{remarkText}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        </Card>

        {/* 4: Current Demand Details */}
      </div>

      {/* Full‑width: All Demands */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">All Demands for this Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 border">Demand ID</th>
                  <th className="px-2 py-1 border">Date</th>
                  <th className="px-2 py-1 border">Amount</th>
                  <th className="px-2 py-1 border">Status</th>
                  <th className="px-2 py-1 border">Remark</th>
                </tr>
              </thead>
              <tbody>
                {workDemands.length > 0 ? (
                  workDemands.map(wd => (
                    <tr
                      key={wd.id}
                      className={wd.id === demand.id ? 'bg-primary/10 font-semibold' : undefined}
                    >
                      <td className="px-2 py-1 border">{wd.id}</td>
                      <td className="px-2 py-1 border">{wd.date}</td>
                      <td className="px-2 py-1 border">₹{wd.amount.toLocaleString()}</td>
                      <td className="px-2 py-1 border">
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

      {/* full-width action buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Button variant="destructive" onClick={handleReject}>
          <XCircle className="w-4 h-4 mr-1" /> Reject
        </Button>
        <Button variant="outline" onClick={handleSendBack}>
          <CornerUpLeft className="w-4 h-4 mr-1" /> Send Back
        </Button>
        <Button variant="default" onClick={handleApprove}>
          <Check className="w-4 h-4 mr-1" /> Approve
        </Button>
      </div>
    </div>
  );
};

export default MlaFundDemandDetails;
