
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, FileText, IndianRupee, Clock, Info, MessageSquare } from 'lucide-react';
import { ApprovalRecordType } from './ApprovalHistory';

interface ApprovalDetailsDialogProps {
  approval: ApprovalRecordType | null;
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: string) => string;
}

const ApprovalDetailsDialog: React.FC<ApprovalDetailsDialogProps> = ({
  approval,
  isOpen,
  onClose,
  formatCurrency
}) => {
  if (!approval) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Approval Details - {approval.idaName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status and Priority */}
          <div className="flex gap-4">
            <Badge className={`${getStatusColor(approval.status)} border`}>
              {approval.status}
            </Badge>
            <Badge className={`${getPriorityColor(approval.priority)} border`}>
              {approval.priority} Priority
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="remarks" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Remarks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">IDA Name</p>
                      <p className="text-lg font-semibold">{approval.idaName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Approved By</p>
                        <p className="font-medium">{approval.approvedBy}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Purpose</p>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-900">{approval.purpose}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-600">Requested Amount</p>
                      <p className="text-2xl font-bold text-blue-800">₹{formatCurrency(approval.requestAmount)}</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${
                      approval.status === 'Approved' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        approval.status === 'Approved' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {approval.status === 'Approved' ? 'Approved Amount' : 'Final Amount'}
                      </p>
                      <p className={`text-2xl font-bold ${
                        approval.status === 'Approved' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {approval.status === 'Approved' 
                          ? `₹${formatCurrency(approval.approvedAmount)}` 
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {approval.status === 'Approved' && approval.requestAmount !== approval.approvedAmount && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <p className="font-medium text-yellow-800">Amount Adjustment</p>
                      </div>
                      <p className="text-sm text-yellow-800">
                        <strong>Difference:</strong> ₹{formatCurrency(
                          (parseFloat(approval.requestAmount) - parseFloat(approval.approvedAmount)).toString()
                        )} reduced from original request
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Processing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Request Submitted</p>
                        <p className="text-sm text-gray-600">
                          {new Date(approval.requestDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        approval.status === 'Approved' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Calendar className={`h-4 w-4 ${
                          approval.status === 'Approved' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {approval.status === 'Approved' ? 'Request Approved' : 'Request Rejected'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(approval.approvalDate).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <p className="font-medium text-blue-800">Processing Summary</p>
                    </div>
                    <p className="text-sm text-blue-800">
                      <strong>Total Processing Time:</strong> {
                        Math.ceil((new Date(approval.approvalDate).getTime() - new Date(approval.requestDate).getTime()) / (1000 * 60 * 60 * 24))
                      } days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="remarks" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Decision Remarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {approval.remarks ? (
                    <div className={`p-4 rounded-lg border-l-4 ${
                      approval.status === 'Approved' 
                        ? 'bg-green-50 border-green-400' 
                        : 'bg-red-50 border-red-400'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${
                          approval.status === 'Approved' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <MessageSquare className={`h-4 w-4 ${
                            approval.status === 'Approved' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium mb-2 ${
                            approval.status === 'Approved' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {approval.status === 'Approved' ? 'Approval Remarks' : 'Rejection Remarks'}
                          </p>
                          <p className={`text-sm ${
                            approval.status === 'Approved' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {approval.remarks}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No remarks provided for this decision.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDetailsDialog;
