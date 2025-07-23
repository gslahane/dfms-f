
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Trash2, Search, Filter, Download, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import FundDisbursementDetails from './FundDemandDetails';
import FundDisbursementForm from './FundDisbursementForm';

const FundDisbursementList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDisbursement, setSelectedDisbursement] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Mock data
  const disbursements = [
    {
      id: 1,
      referenceNo: 'FD-2024-001',
      beneficiaryName: 'ABC Construction Ltd',
      amount: 500000,
      purpose: 'Road Construction Project',
      status: 'Pending',
      district: 'Mumbai',
      scheme: 'Rural Development',
      disbursementDate: '2024-01-15',
      bankName: 'State Bank of India',
      accountNumber: '12345678901'
    },
    {
      id: 2,
      referenceNo: 'FD-2024-002',
      beneficiaryName: 'XYZ Infrastructure',
      amount: 750000,
      purpose: 'Bridge Development',
      status: 'Completed',
      district: 'Pune',
      scheme: 'Urban Infrastructure',
      disbursementDate: '2024-01-14',
      bankName: 'HDFC Bank',
      accountNumber: '98765432109'
    },
    {
      id: 3,
      referenceNo: 'FD-2024-003',
      beneficiaryName: 'PQR Contractors',
      amount: 300000,
      purpose: 'School Building Construction',
      status: 'In Progress',
      district: 'Nashik',
      scheme: 'Education',
      disbursementDate: '2024-01-13',
      bankName: 'ICICI Bank',
      accountNumber: '11223344556'
    },
    {
      id: 4,
      referenceNo: 'FD-2024-004',
      beneficiaryName: 'LMN Suppliers',
      amount: 200000,
      purpose: 'Medical Equipment Supply',
      status: 'Rejected',
      district: 'Nagpur',
      scheme: 'Healthcare',
      disbursementDate: '2024-01-12',
      bankName: 'Bank of Maharashtra',
      accountNumber: '66778899001'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { variant: 'secondary' as const, icon: Clock },
      'In Progress': { variant: 'default' as const, icon: CreditCard },
      'Completed': { variant: 'default' as const, icon: CheckCircle },
      'Rejected': { variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const filteredDisbursements = disbursements.filter(disbursement => {
    const matchesSearch = disbursement.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disbursement.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disbursement.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || disbursement.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleView = (disbursement: any) => {
    setSelectedDisbursement(disbursement);
    setShowDetails(true);
  };

  const handleEdit = (disbursement: any) => {
    setSelectedDisbursement(disbursement);
    setShowEditForm(true);
  };

  const handleDelete = (id: number) => {
    // Delete logic here
    console.log('Delete disbursement:', id);
  };

  if (showDetails && selectedDisbursement) {
    return (
      <FundDisbursementDetails 
        disbursement={selectedDisbursement}
        onBack={() => {
          setShowDetails(false);
          setSelectedDisbursement(null);
        }}
      />
    );
  }

  if (showEditForm && selectedDisbursement) {
    return (
      <FundDisbursementForm 
        disbursement={selectedDisbursement}
        onCancel={() => {
          setShowEditForm(false);
          setSelectedDisbursement(null);
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Demand List</CardTitle>
        <CardDescription>Manage and track all fund Demand</CardDescription>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search disbursements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference No.</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisbursements.map((disbursement) => (
                <TableRow key={disbursement.id}>
                  <TableCell className="font-medium">
                    {disbursement.referenceNo}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{disbursement.beneficiaryName}</p>
                      <p className="text-sm text-gray-500">{disbursement.bankName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-semibold">
                      ₹{disbursement.amount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      <p className="truncate" title={disbursement.purpose}>
                        {disbursement.purpose}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{disbursement.district}</TableCell>
                  <TableCell>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {disbursement.scheme}
                    </span>
                  </TableCell>
                  <TableCell>{disbursement.disbursementDate}</TableCell>
                  <TableCell>
                    {getStatusBadge(disbursement.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleView(disbursement)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(disbursement)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(disbursement.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredDisbursements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No disbursements found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FundDisbursementList;
