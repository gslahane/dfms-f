
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, Filter, IndianRupee, TrendingUp } from 'lucide-react';
import FundEnhancementDetails from './FundEnhancementDetails';

// Mock data for fund enhancement requests
const mockEnhancementRequests = [
  {
    id: '1',
    requestCode: 'FE-2024-001',
    projectName: 'Rural Road Development Phase 2',
    department: 'Rural Development',
    currentBudget: 50000000,
    enhancementAmount: 15000000,
    totalBudget: 65000000,
    status: 'Pending Review',
    urgency: 'High',
    enhancementType: 'Scope Expansion',
    submittedDate: '2024-01-15',
    submittedBy: 'Rajesh Kumar',
    justification: 'Additional villages need to be covered due to high demand and government directive.',
    expectedOutcome: 'Coverage of 10 additional villages with improved connectivity'
  },
  {
    id: '2',
    requestCode: 'FE-2024-002',
    projectName: 'Digital Education Initiative',
    department: 'Education',
    currentBudget: 30000000,
    enhancementAmount: 8000000,
    totalBudget: 38000000,
    status: 'Under Review',
    urgency: 'Medium',
    enhancementType: 'Additional Features',
    submittedDate: '2024-01-12',
    submittedBy: 'Priya Sharma',
    justification: 'Need to include advanced learning management system and teacher training modules.',
    expectedOutcome: 'Enhanced digital learning experience for 5000+ students'
  },
  {
    id: '3',
    requestCode: 'FE-2024-003',
    projectName: 'Healthcare Infrastructure Upgrade',
    department: 'Health & Welfare',
    currentBudget: 75000000,
    enhancementAmount: 20000000,
    totalBudget: 95000000,
    status: 'Approved',
    urgency: 'High',
    enhancementType: 'Quality Improvement',
    submittedDate: '2024-01-10',
    submittedBy: 'Dr. Amit Patel',
    justification: 'Medical equipment costs have increased and additional ICU beds are required.',
    expectedOutcome: 'Modern healthcare facility serving 50,000 patients annually'
  }
];

const FundEnhancementList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredRequests = mockEnhancementRequests.filter(request => {
    const matchesSearch = request.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         request.status.toLowerCase().replace(' ', '-') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending Review': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'Under Review': { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'Approved': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'Rejected': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending Review'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      'High': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'Medium': { variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
      'Low': { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig['Medium'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {urgency}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  if (showDetails && selectedRequest) {
    return (
      <FundEnhancementDetails
        request={selectedRequest}
        onBack={() => setShowDetails(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹43Cr</p>
                <p className="text-sm text-gray-600">Total Enhancement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Enhancement Requests</CardTitle>
          <CardDescription>Track and manage fund enhancement requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by project name, code, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Code</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Current Budget</TableHead>
                  <TableHead>Enhancement</TableHead>
                  <TableHead>Total Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{request.requestCode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.projectName}</p>
                        <p className="text-sm text-gray-500">by {request.submittedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{formatCurrency(request.currentBudget)}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      +{formatCurrency(request.enhancementAmount)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(request.totalBudget)}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                    <TableCell>
                      <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {request.enhancementType}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No fund enhancement requests found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FundEnhancementList;
