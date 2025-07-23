
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AllocationSummary: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Allocation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Budget:</span>
          <span className="font-semibold">₹500.00 Cr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Allocated:</span>
          <span className="font-semibold text-green-600">₹125.50 Cr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Remaining:</span>
          <span className="font-semibold text-primary">₹374.50 Cr</span>
        </div>
        <Separator />
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-800 font-medium">Utilization: 25.1%</p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '25.1%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationSummary;
