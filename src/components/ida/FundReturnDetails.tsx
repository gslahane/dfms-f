
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, IndianRupee, FileText, Building, TrendingUp } from 'lucide-react';
import { FundReturnData } from './FundReturnList';

interface FundReturnDetailsProps {
  record: FundReturnData;
  formatCurrency: (amount: string) => string;
}

const FundReturnDetails: React.FC<FundReturnDetailsProps> = ({ record, formatCurrency }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Submitted': return 'bg-purple-100 text-purple-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReturnReasonText = (reason: string) => {
    switch (reason) {
      case 'unused-allocation': return 'Unused Allocation';
      case 'project-completed': return 'Project Completed';
      case 'scope-change': return 'Scope Change';
      case 'technical-issues': return 'Technical Issues';
      case 'other': return 'Other';
      default: return reason;
    }
  };

  const getReturnTypeText = (type: string) => {
    switch (type) {
      case 'project-completion': return 'Project Completion';
      case 'excess-funds': return 'Excess Funds';
      case 'project-cancellation': return 'Project Cancellation';
      case 'scope-reduction': return 'Scope Reduction';
      case 'cost-saving': return 'Cost Saving';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Project Name
            </label>
            <p className="text-lg font-semibold">{record.projectName}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Department
            </label>
            <p className="text-sm">{record.department}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <Badge className={getStatusColor(record.status)}>
                {record.status}
              </Badge>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Request ID</label>
            <p className="text-sm font-mono">{record.id}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Financial Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Financial Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-blue-600">Return Amount</label>
            <p className="text-2xl font-bold text-blue-700">₹{formatCurrency(record.returnAmount)}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-green-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Utilization
            </label>
            <p className="text-2xl font-bold text-green-700">{record.utilizationPercentage}%</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-purple-600">Return Type</label>
            <p className="text-sm font-semibold text-purple-700">{getReturnTypeText(record.returnType)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Return Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Return Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Return Date</label>
            <p className="text-sm">{new Date(record.returnDate).toLocaleDateString('en-IN')}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Submitted Date</label>
            <p className="text-sm">{new Date(record.submittedDate).toLocaleDateString('en-IN')}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Return Reason</label>
            <p className="text-sm">{getReturnReasonText(record.returnReason)}</p>
          </div>
          
          {record.utrNumber && (
            <div>
              <label className="text-sm font-medium text-gray-500">UTR Number</label>
              <p className="text-sm font-mono">{record.utrNumber}</p>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Justification */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Justification</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm">{record.justification}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Request Submitted</p>
              <p className="text-xs text-gray-500">{new Date(record.submittedDate).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          
          {record.status !== 'Draft' && record.status !== 'Submitted' && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Under Review</p>
                <p className="text-xs text-gray-500">Review in progress</p>
              </div>
            </div>
          )}
          
          {(record.status === 'Approved' || record.status === 'Completed') && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-xs text-gray-500">Return request approved</p>
              </div>
            </div>
          )}
          
          {record.status === 'Completed' && (
            <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-xs text-gray-500">Funds returned successfully</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundReturnDetails;
