
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeftRight } from 'lucide-react';
import { ReturnFundRecord } from './ReturnFunds';
import ReturnFundRecordComponent from './ReturnFundRecord';

interface ReturnFundsHistoryProps {
  records: ReturnFundRecord[];
  onDelete: (id: string) => void;
  formatCurrency: (amount: string) => string;
}

const ReturnFundsHistory: React.FC<ReturnFundsHistoryProps> = ({
  records,
  onDelete,
  formatCurrency
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          Fund Return History
        </CardTitle>
        <CardDescription>
          View and manage all fund return requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IDA</TableHead>
              <TableHead>Return Amount</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>UTR Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <ReturnFundRecordComponent
                key={record.id}
                record={record}
                onDelete={onDelete}
                formatCurrency={formatCurrency}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReturnFundsHistory;
