
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { FundRequest } from './FundApproval';

interface FundApprovalFormProps {
  request: FundRequest;
  onApprove: (requestId: string, approvedAmount: string, remarks: string) => void;
  onReject: (requestId: string, remarks: string) => void;
  formatCurrency: (amount: string) => string;
}

const FundApprovalForm: React.FC<FundApprovalFormProps> = ({
  request,
  onApprove,
  onReject,
  formatCurrency
}) => {
  const [approvedAmount, setApprovedAmount] = useState(request.requestAmount);
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    if (!approvedAmount || parseFloat(approvedAmount) <= 0) {
      alert('Please enter a valid approved amount.');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onApprove(request.id, approvedAmount, remarks);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onReject(request.id, remarks);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Fund Request Details
          </CardTitle>
          <CardDescription>Review the submitted fund request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">IDA Name</Label>
              <p className="text-sm font-semibold">{request.idaName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Requested Amount</Label>
              <p className="text-sm font-semibold">₹{formatCurrency(request.requestAmount)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Request Date</Label>
              <p className="text-sm">{new Date(request.requestDate).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Priority</Label>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                request.priority === 'High' ? 'bg-red-100 text-red-800' :
                request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.priority}
              </span>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-600">Purpose</Label>
              <p className="text-sm">{request.purpose}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Submitted By</Label>
              <p className="text-sm">{request.submittedBy}</p>
            </div>
          </div>

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-600">Attachments</Label>
              <div className="mt-2 space-y-2">
                {request.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Approval Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Approval Decision
          </CardTitle>
          <CardDescription>Make your approval decision</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="approved-amount">Approved Amount (₹)</Label>
            <Input
              id="approved-amount"
              type="number"
              placeholder="Enter approved amount"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Leave as requested amount for full approval, or enter a different amount for partial approval
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Enter your remarks/comments (required for rejection)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Request
                </>
              )}
            </Button>

            <Button
              onClick={handleReject}
              disabled={isProcessing}
              variant="destructive"
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Request
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundApprovalForm;
