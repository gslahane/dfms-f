
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { FundReturnData } from './FundReturnList';
import FundReturnDetails from './FundReturnDetails';

interface FundReturnRecordProps {
  record: FundReturnData;
  formatCurrency: (amount: string) => string;
}

const FundReturnRecord: React.FC<FundReturnRecordProps> = ({
  record,
  formatCurrency
}) => {
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

  const getUtilizationColor = (percentage: string) => {
    const pct = parseFloat(percentage);
    if (pct >= 90) return 'text-green-600';
    if (pct >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{record.projectName}</TableCell>
      <TableCell>₹{formatCurrency(record.returnAmount)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          {new Date(record.returnDate).toLocaleDateString('en-IN')}
        </div>
      </TableCell>
      <TableCell>{record.department}</TableCell>
      <TableCell>
        <span className={`font-medium ${getUtilizationColor(record.utilizationPercentage)}`}>
          {record.utilizationPercentage}%
        </span>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(record.status)}>
          {record.status}
        </Badge>
      </TableCell>
      <TableCell>
        {new Date(record.submittedDate).toLocaleDateString('en-IN')}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Fund Return Details</DialogTitle>
                <DialogDescription>
                  Complete details of the fund return request
                </DialogDescription>
              </DialogHeader>
              <FundReturnDetails record={record} formatCurrency={formatCurrency} />
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            size="sm"
            disabled={record.status === 'Completed' || record.status === 'Approved'}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={record.status === 'Completed' || record.status === 'Approved'}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FundReturnRecord;
