
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Calendar, Trash2 } from 'lucide-react';
import { AllocationRecordType } from './AllocationHistory';

interface AllocationRecordProps {
  allocation: AllocationRecordType;
  onDelete: (id: string) => void;
  formatCurrency: (amount: string) => string;
}

const AllocationRecord: React.FC<AllocationRecordProps> = ({
  allocation,
  onDelete,
  formatCurrency
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Utilized': return 'bg-blue-100 text-blue-800';
      case 'Returned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{allocation.district}</TableCell>
      <TableCell>₹{formatCurrency(allocation.amount)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          {new Date(allocation.allocationDate).toLocaleDateString('en-IN')}
        </div>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(allocation.status)}`}>
          {allocation.status}
        </span>
      </TableCell>
      <TableCell className="max-w-xs truncate" title={allocation.remarks}>
        {allocation.remarks || '-'}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(allocation.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          disabled={allocation.status === 'Utilized'}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AllocationRecord;
