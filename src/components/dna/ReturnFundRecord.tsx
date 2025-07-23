
import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Trash2, FileText } from 'lucide-react';
import { ReturnFundRecord as ReturnFundRecordType } from './ReturnFunds';

interface ReturnFundRecordProps {
  record: ReturnFundRecordType;
  onDelete: (id: string) => void;
  formatCurrency: (amount: string) => string;
}

const ReturnFundRecord: React.FC<ReturnFundRecordProps> = ({
  record,
  onDelete,
  formatCurrency
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{record.idaName}</TableCell>
      <TableCell>₹{formatCurrency(record.returnAmount)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          {new Date(record.returnDate).toLocaleDateString('en-IN')}
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm">{record.utrNumber}</TableCell>
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
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Return Fund Details</DialogTitle>
                <DialogDescription>
                  Complete details of the fund return request
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">IDA</label>
                    <p className="text-sm font-semibold">{record.idaName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Return Amount</label>
                    <p className="text-sm font-semibold">₹{formatCurrency(record.returnAmount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Return Date</label>
                    <p className="text-sm">{new Date(record.returnDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Account</label>
                    <p className="text-sm font-mono">{record.bankAccountNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                    <p className="text-sm font-mono">{record.ifscCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">UTR Number</label>
                    <p className="text-sm font-mono">{record.utrNumber}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Attachments</label>
                  <div className="mt-2 space-y-2">
                    {record.attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {record.remarks && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Remarks</label>
                    <p className="text-sm mt-1">{record.remarks}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(record.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={record.status === 'Completed'}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ReturnFundRecord;
