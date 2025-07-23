import React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import {
  Table, TableHeader, TableHead, TableBody, TableRow, TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IndianRupee, Trash2 } from 'lucide-react';

export interface AllocationRecordType {
  id: string;
  schemeName: string;
  district: string;
  amount: string;
  allocationDate: string;
  utilizationEndDate: string;
  remarks: string;
  status: 'Active' | 'Utilized' | 'Returned';
}

interface AllocationHistoryProps {
  allocations: AllocationRecordType[];
  onDelete: (id: string) => void;
  formatCurrency: (amount: string) => string;
}

const statusColors: Record<AllocationRecordType['status'], string> = {
  Active: 'bg-green-100 text-green-800',
  Utilized: 'bg-blue-100 text-blue-800',
  Returned: 'bg-yellow-100 text-yellow-800',
};

const AllocationHistory: React.FC<AllocationHistoryProps> = ({
  allocations,
  onDelete,
  formatCurrency
}) => {
  return (
    <Card className="shadow-none border">
      <CardHeader className="py-3 px-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <IndianRupee className="h-5 w-5 text-primary" />
          Fund Allocation History
        </CardTitle>
        <CardDescription className="text-xs">
          View and manage all fund allocations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full">
          <Table className="min-w-max text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-1">District</TableHead>
                <TableHead className="px-2 py-1 text-right">Amount (₹)</TableHead>
                <TableHead className="px-2 py-1">Allocation Date</TableHead>
                <TableHead className="px-2 py-1">Utilization End Date</TableHead>
                <TableHead className="px-2 py-1">Remarks</TableHead>
                <TableHead className="px-2 py-1">Status</TableHead>
                <TableHead className="px-2 py-1 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-3 text-gray-400">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                allocations.map(allocation => (
                  <TableRow
                    key={allocation.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="px-2 py-1 whitespace-normal">{allocation.district}</TableCell>
                    <TableCell className="px-2 py-1 whitespace-normal text-right">
                      ₹{formatCurrency(allocation.amount)}
                    </TableCell>
                    <TableCell className="px-2 py-1 whitespace-normal">{allocation.allocationDate}</TableCell>
                    <TableCell className="px-2 py-1 whitespace-normal">{allocation.utilizationEndDate}</TableCell>
                    <TableCell className="px-2 py-1 whitespace-normal">{allocation.remarks}</TableCell>
                    <TableCell className="px-2 py-1 whitespace-normal">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${statusColors[allocation.status]}`}>
                        {allocation.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-1 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50"
                        onClick={() => onDelete(allocation.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationHistory;
