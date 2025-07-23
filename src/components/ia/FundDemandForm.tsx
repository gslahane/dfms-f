import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ChevronDown, Eye, AlertTriangle } from 'lucide-react';

const taxOptions = [
  { id: 1, name: "GST (18%)", percentage: 18 },
  { id: 2, name: "TDS (2%)", percentage: 2 },
  { id: 3, name: "Cess (1%)", percentage: 1 }
];

const isNumber = (value: any) => !isNaN(value) && isFinite(value);

const FundDemandForm = ({
  open,
  onClose,
  work,
  demands,
  addDemand
}: any) => {
  const [demandAmount, setDemandAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedTaxes, setSelectedTaxes] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [warn, setWarn] = useState('');
  const [latestDemandId, setLatestDemandId] = useState('');

  useEffect(() => {
    setLatestDemandId('DM-' + Date.now().toString().slice(-6));
  }, [open, work]);

  const prevDemands = useMemo(
    () => (demands || []).filter((d: any) => work && d.workId === work.id),
    [demands, work]
  );

  const vendor = (work?.vendorDetails || { name: "", aadhar: "" });
  vendor.totalFundReceived = prevDemands.filter((d: any) => d.status === "Approved")
    .reduce((acc: number, d: any) => acc + (d.netPayable ?? d.amount ?? 0), 0);
  vendor.totalTaxDeducted = prevDemands
    .filter((d: any) => d.status === "Approved")
    .reduce((acc: number, d: any) =>
      acc + (Array.isArray(d.taxes)
        ? d.taxes.reduce((s: number, t: any) => s + (t.amount ?? 0), 0) : 0), 0);

  const grossTotal = (work?.workPortionAmount ?? 0) + (work?.taxDeductionAmount ?? 0);
  const totalDemanded = prevDemands.reduce((acc: number, d: any) => acc + (d.amount ?? 0), 0);
  const balanceAmount = grossTotal - totalDemanded;
  const demandNum = Number(demandAmount) || 0;
  const selectedTaxObjs = taxOptions.filter(t => selectedTaxes.includes(t.id));
  const taxAmounts = selectedTaxObjs.map(tax => ({
    ...tax,
    amount: Math.round(demandNum * (tax.percentage / 100))
  }));
  const totalTax = taxAmounts.reduce((acc, t) => acc + (t.amount ?? 0), 0);
  const netPayable = demandNum - totalTax;

  useEffect(() => {
    setError('');
    setWarn('');
    if (!demandAmount) return;
    if (!isNumber(demandAmount) || demandNum <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (demandNum > balanceAmount) {
      setError(`Demand amount exceeds balance limit (₹${(balanceAmount ?? 0).toLocaleString()}).`);
      return;
    }
    if (demandNum === balanceAmount) {
      setWarn('Note: You are demanding the exact remaining balance amount.');
    }
    if (demandNum > 0.9 * balanceAmount && demandNum < balanceAmount) {
      setWarn('Warning: You are demanding more than 90% of the available balance.');
    }
  }, [demandAmount, balanceAmount, demandNum]);

  const handleTaxToggle = (id: number) => {
    setSelectedTaxes(t =>
      t.includes(id) ? t.filter(i => i !== id) : [...t, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !demandNum || demandNum <= 0) return;
    if (!remarks.trim()) {
      setError('Enter purpose/remarks.');
      return;
    }
    addDemand({
      id: latestDemandId,
      workId: work.id,
      workName: work.name,
      vendor: vendor.name,
      amount: demandNum,
      netPayable,
      taxes: taxAmounts,
      scheme: work.scheme,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      remarks
    });
    setDemandAmount('');
    setRemarks('');
    setSelectedTaxes([]);
    setWarn('');
    onClose();
  };

  if (!open || !work) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full md:w-[80vw] max-w-none p-3 relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
        <h2 className="text-2xl font-bold mb-2">Raise Fund Demand</h2>

        {/* Work & Scheme Details */}
        <Card className="mb-2">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-lg flex items-center gap-2">
              {work.scheme}
            </CardTitle>
            <div className="text-xs text-gray-400">Scheme Name</div>
          </CardHeader>
          <CardContent className="p-2 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                            <div><span className="font-medium text-gray-600">Work Name</span><div>{work.name}</div></div>

              <div><span className="font-medium text-gray-600">Sanctioned Date</span><div>{work.sanctionedDate}</div></div>
              <div><span className="font-medium text-gray-600">Financial Year</span><div>{work.financialYear}</div></div>
              {/* <div><span className="font-medium text-gray-600">Work Start Date</span><div>{work.workStartDate}</div></div>
              <div><span className="font-medium text-gray-600">Work End Date</span><div>{work.workEndDate}</div></div> */}
              <div className="flex items-center gap-2">
                <div><span className="font-medium text-gray-600">Admin Approved Amount</span>
                  <div>₹{(work.adminApprovedAmount ?? 0).toLocaleString()}</div></div>
                {work.aaLetter && (
                  <a href={work.aaLetter} target="_blank" rel="noopener noreferrer" title="View AA Letter">
                    <Eye className="inline-block w-5 h-5 text-primary ml-1 cursor-pointer" />
                  </a>
                )}
              </div>
              <div><span className="font-medium text-gray-600">Work Portion Amount</span>
                <div>₹{(work.workPortionAmount ?? 0).toLocaleString()}</div></div>
              <div className="flex items-center gap-2">
                <div><span className="font-medium text-gray-600">Gross Total</span>
                  <div>₹{(grossTotal ?? 0).toLocaleString()}</div></div>
                {work.sanctionedLetter && (
                  <a href={work.sanctionedLetter} target="_blank" rel="noopener noreferrer" title="View Sanctioned Letter">
                    <Eye className="inline-block w-5 h-5 text-primary ml-1 cursor-pointer" />
                  </a>
                )}
              </div>
              <div><span className="font-medium text-gray-600">Total Demanded</span>
                <div>₹{(totalDemanded ?? 0).toLocaleString()}</div></div>
              <div><span className="font-medium text-gray-600">Balance Amount</span>
                <div className="font-bold text-primary">₹{(balanceAmount ?? 0).toLocaleString()}</div></div>
              <div><span className="font-medium text-gray-600">IA / PWD</span><div>{work.ia || 'PWD'}</div></div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Details */}
        <Card className="mb-2">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-base">Vendor Details</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-1">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-medium text-gray-600">Vendor Name</span><div>{vendor.name}</div></div>
              <div><span className="font-medium text-gray-600">Aadhar No.</span><div>{vendor.aadhar}</div></div>
              <div><span className="font-medium text-gray-600">Total Fund Received</span><div>₹{(vendor.totalFundReceived ?? 0).toLocaleString()}</div></div>
              <div><span className="font-medium text-gray-600">Total Tax Deducted</span><div>₹{(vendor.totalTaxDeducted ?? 0).toLocaleString()}</div></div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Form */}
        <Card className="mb-2">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-base">Raise New Fund Demand</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-1">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Demand ID */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Demand ID</label>
                <Input value={latestDemandId} readOnly disabled />
              </div>
              {/* Demand Amount */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Demand Amount</label>
                <Input
                  type="number"
                  min={1}
                  max={balanceAmount}
                  value={demandAmount}
                  onChange={e => setDemandAmount(e.target.value.replace(/^0+/, ''))}
                  placeholder="Enter amount"
                  required
                />
              </div>
              {/* Select Taxes */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold text-gray-700">Select Taxes</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full border rounded-lg px-3 py-2 flex items-center justify-between bg-gray-50"
                    onClick={() => setShowDropdown(v => !v)}
                  >
                    {selectedTaxObjs.length > 0
                      ? selectedTaxObjs.map(t => t.name).join(', ')
                      : 'Select taxes to apply'}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showDropdown && (
                    <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
                      {taxOptions.map(tax => (
                        <label key={tax.id} className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={selectedTaxes.includes(tax.id)}
                            onChange={() => handleTaxToggle(tax.id)}
                            className="mr-2"
                          />
                          {tax.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {taxAmounts.length > 0 && (
                  <ul className="text-xs mt-1 text-gray-600">
                    {taxAmounts.map(t => (
                      <li key={t.id}>{t.name}: ₹{(t.amount ?? 0).toLocaleString()}</li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Remarks */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold text-gray-700">Purpose / Remarks</label>
                <Input
                  type="text"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Enter purpose/remarks"
                  required
                />
              </div>
              {/* Totals */}
              <div className="md:col-span-2 grid grid-cols-2 gap-2">
                <div><span className="font-semibold text-gray-700">Total Tax</span><div>₹{(totalTax ?? 0).toLocaleString()}</div></div>
                <div><span className="font-semibold text-gray-700">Net Payable to Vendor</span>
                  <div className="font-bold text-primary">₹{(netPayable > 0 ? netPayable : 0).toLocaleString()}</div>
                </div>
              </div>
              {/* Warnings */}
              {warn && (
                <div className="col-span-2 flex items-center text-yellow-700 bg-yellow-50 rounded p-2 gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-700" />
                  {warn}
                </div>
              )}
              {error && (
                <div className="col-span-2 flex items-center text-red-700 bg-red-50 rounded p-2 gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-700" />
                  {error}
                </div>
              )}
              {/* Submit */}
              <div className="col-span-2 flex justify-end">
                <Button
                  type="submit"
                  className="flex items-center gap-2"
                  disabled={!!error || !demandNum || demandNum <= 0}
                >
                  <Plus className="h-4 w-4" />
                  Raise Demand
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* All Demands Table */}
        <Card>
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-base">All Demands for this Work</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-1">
            {prevDemands.length === 0 ? (
              <div className="text-sm text-gray-500">No demands yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr>
                      {["Demand ID", "Amount", "Net Payable", "Date", "Remarks", "Taxes", "Status"].map(header => (
                        <th key={header} className="px-1 py-0.5 border">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prevDemands.map((d: any) => (
                      <tr key={d.id}>
                        <td className="px-1 py-0.5 border">{d.id}</td>
                        <td className="px-1 py-0.5 border">₹{(d.amount ?? 0).toLocaleString()}</td>
                        <td className="px-1 py-0.5 border">₹{(d.netPayable ?? d.amount ?? 0).toLocaleString()}</td>
                        <td className="px-1 py-0.5 border">{d.date}</td>
                        <td className="px-1 py-0.5 border">{d.remarks}</td>
                        <td className="px-1 py-0.5 border">
                          {d.taxes && d.taxes.length > 0 ? d.taxes.map((tax: any, idx: number) => (
                            <div key={idx}>{tax.name}: ₹{(tax.amount ?? 0).toLocaleString()}</div>
                          )) : <span className="text-xs text-gray-400">-</span>}
                        </td>
                        <td className="px-1 py-0.5 border"><Badge>{d.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FundDemandForm;
