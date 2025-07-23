import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Eye, Check, X } from 'lucide-react';
import FundDemandDetails from './FundDemandDetails';

// -- Dummy Data (same as before)
const dummyWorks: Work[] = [
  {
    id: 4,
    district: 'Pune',
    scheme: '44061122 (2) Forest Roads & Bridges',
    name: 'GP/2425/5291 मौजे कडबनवाडी निरीक्षण पथ तयार करणे',
    limit: 2_500_000,
    sanctionedDate: '2024-02-27',
    financialYear: '2024-25',
    vendorDetails: { name: 'OM Nikas', aadhar: '1234-5678-9012' },
    adminApprovedAmount: 73_026_000,
    workPortionAmount: 65_000_000,
    taxDeductionAmount: 5_000_000,
    status: 'Pending',
  },
  {
    id: 5,
    district: 'Pune',
    scheme: '44061122 (2) Forest Roads & Bridges',
    name: 'GP/2425/5290 मौजे रुई निरीक्षण पथ तयार करणे',
    limit: 2_499_999,
    sanctionedDate: '2024-02-27',
    financialYear: '2024-25',
    vendorDetails: { name: 'RRB INFRA', aadhar: '9876-5432-1098' },
    adminApprovedAmount: 1_600_000,
    workPortionAmount: 1_450_000,
    taxDeductionAmount: 100_000,
    status: 'Pending',
  },
  {
    id: 6,
    district: 'Pune',
    scheme: '2053A233 Dynamic Admin & Emergency Mgmt',
    name: 'GP/2425/5463 Collector Bunglow LED & Inverter Renovation',
    limit: 1_999_993,
    sanctionedDate: '2024-02-27',
    financialYear: '2024-25',
    vendorDetails: { name: 'SK Buildcon', aadhar: '5678-1234-9012' },
    adminApprovedAmount: 747_237,
    workPortionAmount: 710_230,
    taxDeductionAmount: 35_000,
    status: 'Pending',
  },
];

const dummyDemands: Demand[] = [
  {
    id: 'DM-02',
    workId: 4,
    amount: 200_000,
    netPayable: 190_000,
    taxes: [{ id: 4, name: 'GST (5%)', amount: 10_000 }],
    status: 'Approved',
    date: '2024-07-01',
    remarks: 'प्रथम हप्ता',
  },
  {
    id: 'DM-03',
    workId: 5,
    amount: 250_000,
    netPayable: 240_000,
    taxes: [{ id: 5, name: 'TDS (4%)', amount: 10_000 }],
    status: 'Pending',
    date: '2024-07-02',
    remarks: 'पहिली मागणी',
  },
  {
    id: 'DM-04',
    workId: 6,
    amount: 150_000,
    netPayable: 147_000,
    taxes: [{ id: 6, name: 'GST (2%)', amount: 3_000 }],
    status: 'Approved',
    date: '2024-07-03',
    remarks: 'दुसरी मागणी',
  },
];

export default function DashboardWorkDemand() {
  // -- filter state --
  const [fyFilter, setFyFilter] = useState<'All' | string>('All');
  const [planType, setPlanType] = useState<'DAP' | 'MLA' | 'HADP'>('DAP');
  const [districtFilter, setDistrictFilter] = useState<'All' | string>('All');
  const [schemeFilter, setSchemeFilter] = useState<'All' | string>('All');
  const [talukaFilter, setTalukaFilter] = useState<'All' | string>('All');

  // -- detail modal state --
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // -- dropdown options --
  const fyOptions = useMemo(() => ['All', ...new Set(dummyWorks.map(w => w.financialYear))], []);
  const planTypeOptions = ['DAP', 'MLA', 'HADP'];
  const districtOptions = useMemo(() => {
    if (planType === 'HADP') {
      return ['All', ...new Set(dummyWorks.map(w => w.district).filter(Boolean))];
    }
    return ['All', ...new Set(dummyWorks.map(w => w.district).filter(Boolean))];
  }, [planType]);
  const schemeOptions = useMemo(() => ['All', ...new Set(dummyWorks.map(w => w.scheme).filter(Boolean))], []);
  const talukaOptions = useMemo(() => {
    if (planType !== 'HADP') return ['All'];
    // You can replace this with actual Taluka data if available on your works/demands
    return ['All', ...new Set(dummyWorks.map(w => w.name.split(' ')[3]).filter(Boolean))];
  }, [planType, districtFilter]);

  // -- filtered demands --
  const filtered = useMemo(() => {
    return dummyDemands.filter(d => {
      const w = dummyWorks.find(w => w.id === d.workId)!;
      if (fyFilter !== 'All' && w.financialYear !== fyFilter) return false;
      if (planType === 'HADP') {
        if (districtFilter !== 'All' && w.district !== districtFilter) return false;
        if (talukaFilter !== 'All' && w.name.split(' ')[3] !== talukaFilter) return false;
      } else {
        if (districtFilter !== 'All' && w.district !== districtFilter) return false;
        if (schemeFilter !== 'All' && w.scheme !== schemeFilter) return false;
      }
      return true;
    });
  }, [fyFilter, planType, districtFilter, schemeFilter, talukaFilter]);

  const openDetails = (id: string) => { setDetailId(id); setDetailOpen(true); };
  const handleApprove = (id: string) => alert(`Approved ${id}`);
  const handleReject = (id: string) => alert(`Rejected ${id}`);

  // -- compute totals --
  const totals = useMemo(() => {
    const totalAA = filtered.reduce((sum, d) => sum + dummyWorks.find(w => w.id === d.workId)!.adminApprovedAmount, 0);
    const totalBal = filtered.reduce((sum, d) => sum + (dummyWorks.find(w => w.id === d.workId)!.limit - d.amount), 0);
    const totalNP = filtered.reduce((sum, d) => sum + d.netPayable, 0);
    return { totalAA, totalBal, totalNP };
  }, [filtered]);

  return (
    <div className="p-6 bg-gray-50 space-y-6">
      {/* Filters */}
      <Card className="border border-gray-200 rounded-sm shadow-sm">
        <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs mb-1">Financial Year</span>
            <Select value={fyFilter} onValueChange={setFyFilter}>
              <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {fyOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs mb-1">Plan Type</span>
            <Select value={planType} onValueChange={val => {
              setPlanType(val as any);
              setDistrictFilter('All');
              setSchemeFilter('All');
              setTalukaFilter('All');
            }}>
              <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                <SelectValue placeholder="Plan Type" />
              </SelectTrigger>
              <SelectContent>
                {planTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {planType === 'HADP' ? (
            <>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">District</span>
                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districtOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">Taluka</span>
                <Select value={talukaFilter} onValueChange={setTalukaFilter}>
                  <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                    <SelectValue placeholder="Taluka" />
                  </SelectTrigger>
                  <SelectContent>
                    {talukaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">District</span>
                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districtOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">Scheme</span>
                <Select value={schemeFilter} onValueChange={setSchemeFilter}>
                  <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                    <SelectValue placeholder="Scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Fund Demands</CardTitle>
          <span className="text-sm text-red-600 italic">*All Amounts Are in Thousands</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {['Sr','District','Scheme','Demand ID','AA Amt','Balance','Net Payable','Actions']
                  .map(h => (
                    <th
                      key={h}
                      className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase"
                    >
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}
                      className="border border-gray-200 py-6 text-center text-gray-400 text-sm">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((d, idx) => {
                  const w = dummyWorks.find(w => w.id === d.workId)!;
                  const balance = w.limit - d.amount;
                  return (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-2 text-sm">{idx + 1}</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">{w.district}</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">{w.scheme}</td>
                      <td className="border border-gray-200 px-3 py-2 text-sm">{d.id}</td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-sm">
                        ₹{w.adminApprovedAmount.toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-sm">
                        ₹{balance.toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-right text-sm">
                        ₹{d.netPayable.toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-sm flex justify-center space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => handleApprove(d.id)}>
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleReject(d.id)}>
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                        <Dialog open={detailOpen && detailId === d.id} onOpenChange={setDetailOpen}>
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => openDetails(d.id)}>
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[80vw] max-w-3xl">
                            <FundDemandDetails
                              open={detailOpen && detailId === d.id}
                              onClose={() => setDetailOpen(false)}
                              demand={d}
                              work={w}
                              vendor={w.vendorDetails}
                              demands={dummyDemands}
                            />
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4}
                    className="border border-gray-200 px-3 py-2 text-right font-semibold text-sm">
                  Total
                </td>
                <td className="border border-gray-200 px-3 py-2 font-semibold text-sm">
                  ₹{totals.totalAA.toLocaleString()}
                </td>
                <td className="border border-gray-200 px-3 py-2 font-semibold text-sm">
                  ₹{totals.totalBal.toLocaleString()}
                </td>
                <td className="border border-gray-200 px-3 py-2 font-semibold text-sm">
                  ₹{totals.totalNP.toLocaleString()}
                </td>
                <td className="border border-gray-200 px-3 py-2" />
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
