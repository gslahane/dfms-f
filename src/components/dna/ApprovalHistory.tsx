import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Trash2 } from 'lucide-react';

export interface ApprovalRecordType {
  id: string;
  idaName: string;
  workName: string;
  requestAmount: string;
  approvedAmount: string;
  requestDate: string;
  approvalDate: string;
  purpose: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  priority: 'Low' | 'Medium' | 'High';
  approvedBy: string;
  remarks: string;
}

interface ApprovalHistoryProps {
  approvals: ApprovalRecordType[];
  onDelete: (id: string) => void;
  formatCurrency: (amount: string) => string;
}

const statusColors: any = {
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800"
};
const priorityColors: any = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800"
};

const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({
  approvals,
  onDelete,
  formatCurrency
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Fund Approval History
        </CardTitle>
        <CardDescription>
          View and manage all fund approval decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IDA Name</TableHead>
              <TableHead>Work Name</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Approval Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Approved By</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>{approval.idaName}</TableCell>
                <TableCell>{approval.workName || "-"}</TableCell>
                <TableCell>{approval.purpose}</TableCell>
                <TableCell>₹{formatCurrency(approval.requestAmount)}</TableCell>
                <TableCell>₹{formatCurrency(approval.approvedAmount)}</TableCell>
                <TableCell>{approval.requestDate}</TableCell>
                <TableCell>{approval.approvalDate || "-"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[approval.status]}`}>
                    {approval.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${priorityColors[approval.priority]}`}>
                    {approval.priority}
                  </span>
                </TableCell>
                <TableCell>{approval.approvedBy}</TableCell>
                <TableCell>{approval.remarks}</TableCell>
                <TableCell className="text-right">
                  <button
                    className="hover:bg-red-100 p-1 rounded"
                    title="Delete"
                    onClick={() => onDelete(approval.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {approvals.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-2 text-gray-400">
                  No approval records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApprovalHistory;
