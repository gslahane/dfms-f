import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';

const schemesData = [
  { id: 's1', name: '30543611 ग्रामीण रस्ते विकास व मजबुतीकरण', limit: 300000, utilized: 100000 },
  { id: 's2', name: 'सर्वसाधारण जिल्हा वार्षिक योजना', limit: 400000, utilized: 400000 },
  { id: 's3', name: 'अन्य विशेष योजना', limit: 250000, utilized: 150000 }
];

const DISTRICT_LIMIT = 1100000;

export default function ReappropriationTab() {
  const [fromScheme, setFromScheme] = useState<string>('s1');
  const [toScheme, setToScheme] = useState<string>('s2');
  const [transferAmount, setTransferAmount] = useState<string>('');

  // Find scheme data by ID
  const from = useMemo(() => schemesData.find(s => s.id === fromScheme), [fromScheme]);
  const to = useMemo(() => schemesData.find(s => s.id === toScheme), [toScheme]);
  const transferNum = Number(transferAmount) || 0;

  const fromBalance = from ? from.limit - from.utilized : 0;
  const toBalance = to ? to.limit - to.utilized : 0;

  // Calculate live values
  const fromNewBalance = fromBalance - transferNum;
  const toNewLimit = to ? to.limit + transferNum : 0;

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <CardTitle className="text-xl font-bold">Re-Appropriation (Fund Limit Transfer)</CardTitle>
        <div className="text-right space-y-1">
          <div className="font-semibold text-gray-600">District Limit: <span className="text-blue-700">₹{DISTRICT_LIMIT.toLocaleString()}</span></div>
          <div className="text-xs text-gray-500">Balance: <span className="font-semibold">{(DISTRICT_LIMIT - schemesData.reduce((t, s) => t + s.utilized, 0)).toLocaleString()}</span></div>
        </div>
      </CardHeader>
<CardContent>
  <div className="flex flex-col lg:flex-row gap-8 justify-between items-stretch">
    {/* From Scheme */}
    <div className="flex-1 flex flex-col border rounded-lg bg-blue-50 p-4 min-h-[300px]">
      <label className="font-semibold mb-1">From Scheme</label>
      <Select value={fromScheme} onValueChange={setFromScheme}>
        <SelectTrigger>
          <SelectValue placeholder="Select Scheme" />
        </SelectTrigger>
        <SelectContent>
          {schemesData.filter(s => s.id !== toScheme).map(s => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {from && (
        <div className="mt-4 text-xs space-y-1">
          <div>Scheme Limit: <span className="font-semibold">₹{from.limit.toLocaleString()}</span></div>
          <div>Utilized: <span className="text-orange-600 font-semibold">₹{from.utilized.toLocaleString()}</span></div>
          <div>Balance Limit: <span className="text-green-700 font-semibold">₹{fromBalance.toLocaleString()}</span></div>
        </div>
      )}
      <div className="mt-4">
        <label className="font-semibold block mb-1">Transfer Amount</label>
        <Input
          type="number"
          min={0}
          max={fromBalance}
          value={transferAmount}
          onChange={e => setTransferAmount(e.target.value.replace(/^0+/, ''))}
          placeholder="Enter transfer amount"
        />
        <div className="text-xs text-gray-400 mt-1">
          (Max: ₹{fromBalance.toLocaleString()})
        </div>
        {transferNum > fromBalance && (
          <div className="text-xs text-red-600">Amount exceeds balance!</div>
        )}
      </div>
      <div className="mt-auto pt-4">
        <div className="text-xs font-semibold">
          New Balance after transfer: <span className={fromNewBalance < 0 ? "text-red-700" : "text-green-700"}>₹{fromNewBalance.toLocaleString()}</span>
        </div>
      </div>
    </div>

    {/* Arrow */}
    <div className="hidden lg:flex flex-col justify-center items-center w-20">
      <ArrowRightLeft className="h-12 w-12 text-blue-600" />
    </div>

    {/* To Scheme */}
    <div className="flex-1 flex flex-col border rounded-lg bg-blue-50 p-4 min-h-[300px]">
      <label className="font-semibold mb-1">To Scheme</label>
      <Select value={toScheme} onValueChange={setToScheme}>
        <SelectTrigger>
          <SelectValue placeholder="Select Scheme" />
        </SelectTrigger>
        <SelectContent>
          {schemesData.filter(s => s.id !== fromScheme).map(s => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {to && (
        <div className="mt-4 text-xs space-y-1">
          <div>Scheme Limit: <span className="font-semibold">₹{to.limit.toLocaleString()}</span></div>
          <div>Utilized: <span className="text-orange-600 font-semibold">₹{to.utilized.toLocaleString()}</span></div>
          <div>Balance Limit: <span className="text-green-700 font-semibold">₹{toBalance.toLocaleString()}</span></div>
        </div>
      )}
      <div className="mt-auto pt-4">
        <div className="text-xs font-semibold">
          New Limit after transfer: <span className="text-blue-700">₹{toNewLimit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  </div>
</CardContent>
    </Card>
  );
}
