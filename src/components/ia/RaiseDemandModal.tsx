import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, CheckCircle, Clock } from 'lucide-react';

// Dummy data props for demonstration
const workData = {
  schemeName: 'Urban Infra 2024',
  workName: 'Main Road Widening',
  sanctionedDate: '2024-04-15',
  financialYear: '2024-25',
  adminApprovedAmount: 1200000,
  workPortionAmount: 1000000,
  taxDeductionAmount: 200000,
};

const previousDemands = [
  {
    id: 'DM-001',
    amount: 300000,
    date: '2024-05-01',
    status: 'Approved',
    remarks: 'Initial phase demand',
  },
  {
    id: 'DM-002',
    amount: 200000,
    date: '2024-06-10',
    status: 'Pending',
    remarks: 'Equipment procurement',
  },
];

// Balance Calculation
const grossTotal = workData.adminApprovedAmount + workData.taxDeductionAmount;
const totalDemanded = previousDemands.reduce((acc, d) => acc + d.amount, 0);
const balanceAmount = grossTotal - totalDemanded;

const getStatusBadge = (status: string) => {
  const statusConfig = {
    'Pending': { variant: 'secondary' as const, icon: Clock },
    'Approved': { variant: 'default' as const, icon: CheckCircle },
    'Rejected': { variant: 'destructive' as const, icon: X }
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

const RaiseDemandModal = ({ onClose }: { onClose: () => void }) => {
  const [demandAmount, setDemandAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [demands, setDemands] = useState(previousDemands);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amountNum = Number(demandAmount);
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid demand amount');
      return;
    }
    if (amountNum > balanceAmount) {
      setError('Demand amount cannot exceed current balance');
      return;
    }
    if (!reason.trim()) {
      setError('Enter reason for demand');
      return;
    }
    // Add new demand (for demo, set as Pending)
    setDemands([
      ...demands,
      {
        id: `DM-00${demands.length + 1}`,
        amount: amountNum,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        remarks: reason,
      },
    ]);
    setDemandAmount('');
    setReason('');
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
        <h2 className="text-2xl font-bold mb-2">Work Demand Details</h2>
        <p className="text-sm text-gray-500 mb-6">
          Review the work information and raise a new fund demand below.
        </p>

        {/* Work Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{workData.workName}</CardTitle>
            <CardDescription>{workData.schemeName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="font-medium text-gray-600">Sanctioned Date</div>
                <div>{workData.sanctionedDate}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Financial Year</div>
                <div>{workData.financialYear}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Admin Approved Amount</div>
                <div>₹{workData.adminApprovedAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Work Portion Amount</div>
                <div>₹{workData.workPortionAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Tax/Deduction Amount</div>
                <div>₹{workData.taxDeductionAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Gross Total</div>
                <div>₹{grossTotal.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Total Demanded</div>
                <div>₹{totalDemanded.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Balance Amount</div>
                <div className="font-bold text-primary">₹{(grossTotal - demands.reduce((acc, d) => acc + d.amount, 0)).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Raise New Fund Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Demand Amount</label>
                <Input
                  type="number"
                  min={1}
                  max={grossTotal - demands.reduce((acc, d) => acc + d.amount, 0)}
                  value={demandAmount}
                  onChange={e => setDemandAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Purpose / Remarks</label>
                <Textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Enter purpose/remarks"
                  required
                />
              </div>
              {error && <div className="col-span-2 text-red-600 text-sm mt-2">{error}</div>}
              <div className="col-span-2 flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Raise Demand
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Previous Demands */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Previous Demands for this Work</CardTitle>
          </CardHeader>
          <CardContent>
            {demands.length === 0 ? (
              <div className="text-sm text-gray-500">No previous demands yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 text-left">Demand ID</th>
                      <th className="py-2 px-3 text-left">Amount</th>
                      <th className="py-2 px-3 text-left">Date</th>
                      <th className="py-2 px-3 text-left">Status</th>
                      <th className="py-2 px-3 text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demands.map(d => (
                      <tr key={d.id} className="border-b">
                        <td className="py-2 px-3">{d.id}</td>
                        <td className="py-2 px-3">₹{d.amount.toLocaleString()}</td>
                        <td className="py-2 px-3">{d.date}</td>
                        <td className="py-2 px-3">{getStatusBadge(d.status)}</td>
                        <td className="py-2 px-3">{d.remarks}</td>
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

export default RaiseDemandModal;
