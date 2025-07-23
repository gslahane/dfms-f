import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';           // ← Add this
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

const AllocationHistory: React.FC<AllocationHistoryProps> = ({
  allocations,
  onDelete,
  formatCurrency
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" />
          Fund Allocation History
        </CardTitle>
        <CardDescription>View and manage all fund allocations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scheme Name</TableHead>
              <TableHead>District</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
              <TableHead>Allocation Date</TableHead>
              <TableHead>Utilization End Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map(allocation => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.schemeName}</TableCell>
                <TableCell>{allocation.district}</TableCell>
                <TableCell className="text-right">
                  ₹{formatCurrency(allocation.amount)}
                </TableCell>
                <TableCell>{allocation.allocationDate}</TableCell>
                <TableCell>{allocation.utilizationEndDate}</TableCell>
                <TableCell>{allocation.remarks}</TableCell>
                <TableCell>{allocation.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onDelete(allocation.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AllocationHistory;
