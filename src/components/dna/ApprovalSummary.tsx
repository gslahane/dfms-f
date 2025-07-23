
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

const ApprovalSummary: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Approval Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">Pending Requests:</span>
            </div>
            <span className="font-semibold text-orange-600">2</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Approved This Month:</span>
            </div>
            <span className="font-semibold text-green-600">15</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">Rejected This Month:</span>
            </div>
            <span className="font-semibold text-red-600">3</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total Approved Amount:</span>
            <span className="font-semibold text-primary">₹45.2 Cr</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Average Processing Time:</span>
            <span className="font-semibold">2.5 days</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800 font-medium">Approval Rate: 83%</p>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Avg. Approval Amount</p>
            <p className="text-lg font-bold text-blue-900">₹3.2 Cr</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800 font-medium">High Priority Pending</p>
            <p className="text-lg font-bold text-purple-900">1</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalSummary;
