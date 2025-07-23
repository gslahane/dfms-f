
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, Search, Filter } from 'lucide-react';
import FundReturnRecord from './FundReturnRecord';

export interface FundReturnData {
  id: string;
  projectName: string;
  returnAmount: string;
  returnDate: string;
  returnReason: string;
  returnType: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  department: string;
  submittedDate: string;
  utrNumber?: string;
  utilizationPercentage: string;
  justification: string;
}

const FundReturnList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [returnRecords] = useState<FundReturnData[]>([
    {
      id: '1',
      projectName: 'Rural Road Development Phase 1',
      returnAmount: '5000000',
      returnDate: '2024-01-15',
      returnReason: 'project-completed',
      returnType: 'project-completion',
      status: 'Completed',
      department: 'Rural Development',
      submittedDate: '2024-01-10',
      utrNumber: 'UTR2024011512345',
      utilizationPercentage: '95',
      justification: 'Project completed successfully with cost savings'
    },
    {
      id: '2',
      projectName: 'School Infrastructure Development',
      returnAmount: '2500000',
      returnDate: '2024-01-20',
      returnReason: 'unused-allocation',
      returnType: 'excess-funds',
      status: 'Under Review',
      department: 'Education',
      submittedDate: '2024-01-18',
      utilizationPercentage: '85',
      justification: 'Excess funds due to competitive bidding'
    },
    {
      id: '3',
      projectName: 'Healthcare Center Upgrade',
      returnAmount: '3200000',
      returnDate: '2024-01-25',
      returnReason: 'scope-change',
      returnType: 'scope-reduction',
      status: 'Approved',
      department: 'Health & Welfare',
      submittedDate: '2024-01-22',
      utilizationPercentage: '75',
      justification: 'Scope reduced due to site constraints'
    }
  ]);

  const filteredRecords = returnRecords.filter(record => {
    const matchesSearch = record.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by project name or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Rural Development">Rural Development</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Health & Welfare">Health & Welfare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fund Return List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Fund Return Requests
          </CardTitle>
          <CardDescription>
            Manage and track all fund return requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Return Amount</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Utilization %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <FundReturnRecord
                  key={record.id}
                  record={record}
                  formatCurrency={formatCurrency}
                />
              ))}
            </TableBody>
          </Table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fund return requests found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FundReturnList;
