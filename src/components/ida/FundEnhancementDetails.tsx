
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar,  User, Building, TrendingUp, FileText, Target } from 'lucide-react';

interface FundEnhancementDetailsProps {
  request: any;
  onBack: () => void;
}

const FundEnhancementDetails: React.FC<FundEnhancementDetailsProps> = ({ request, onBack }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending Review': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'Under Review': { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'Approved': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'Rejected': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending Review'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      'High': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'Medium': { variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
      'Low': { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig['Medium'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {urgency}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{request.projectName}</h1>
          <p className="text-gray-600">{request.requestCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhancement Request Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Justification</h4>
                <p className="text-gray-700">{request.justification}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Expected Outcome</h4>
                <p className="text-gray-700">{request.expectedOutcome}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Enhancement Type</h4>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {request.enhancementType}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Financial Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Approved Budget:</span>
                  <span className="font-semibold text-lg">{formatCurrency(request.currentBudget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Requested Enhancement:</span>
                  <span className="font-semibold text-lg text-green-600">
                    +{formatCurrency(request.enhancementAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Project Budget:</span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(request.totalBudget)}
                  </span>
                </div>
                
                {/* Enhancement Percentage */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Enhancement Percentage:</span>
                    <span className="font-semibold">
                      {((request.enhancementAmount / request.currentBudget) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review History */}
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Request Submitted</p>
                    <p className="text-sm text-gray-600">by {request.submittedBy} on {new Date(request.submittedDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Initial enhancement request submitted for review</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Under Technical Review</p>
                    <p className="text-sm text-gray-600">by Technical Committee on {new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Technical feasibility assessment in progress</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-500">Financial Review - Pending</p>
                    <p className="text-sm text-gray-500">Awaiting financial committee approval</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(request.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Urgency:</span>
                {getUrgencyBadge(request.urgency)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {request.enhancementType}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-gray-600">{request.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Request Code</p>
                  <p className="text-sm text-gray-600">{request.requestCode}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Submitted Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(request.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Submitted By</p>
                  <p className="text-sm text-gray-600">{request.submittedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default">
                Approve Enhancement
              </Button>
              <Button className="w-full" variant="outline">
                Request Modifications
              </Button>
              <Button className="w-full" variant="destructive">
                Reject Request
              </Button>
              <Button className="w-full" variant="outline">
                Add Comments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FundEnhancementDetails;
