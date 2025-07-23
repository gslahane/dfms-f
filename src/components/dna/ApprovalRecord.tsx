
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye } from 'lucide-react';
import { ApprovalRecordType } from './ApprovalHistory';
import ApprovalDetailsDialog from './ApprovalDetailsDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ApprovalRecordProps {
  approval: ApprovalRecordType;
  onDelete: (id: string) => void;
  formatCurrency: (amount: string) => string;
}

const ApprovalRecord: React.FC<ApprovalRecordProps> = ({
  approval,
  onDelete,
  formatCurrency
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this approval record?')) {
      onDelete(approval.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{approval.idaName}</TableCell>
        <TableCell>₹{formatCurrency(approval.requestAmount)}</TableCell>
        <TableCell>
          {approval.status === 'Approved' 
            ? `₹${formatCurrency(approval.approvedAmount)}` 
            : '-'
          }
        </TableCell>
        <TableCell>{new Date(approval.requestDate).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(approval.approvalDate).toLocaleDateString()}</TableCell>
        <TableCell>
          <Badge className={getStatusColor(approval.status)}>
            {approval.status}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge className={getPriorityColor(approval.priority)}>
            {approval.priority}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex gap-2 justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDetailsOpen(true)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Record</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableCell>
      </TableRow>

      <ApprovalDetailsDialog
        approval={approval}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        formatCurrency={formatCurrency}
      />
    </>
  );
};

export default ApprovalRecord;
