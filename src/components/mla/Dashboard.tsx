import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Wallet, 
  Building2, 
  CheckCircle, 
  Clock,
  Search,
  Download,
  ExternalLink,
  TrendingUp,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Types for the API response
interface MLADashboardData {
  totalWorks: number;
  worksByStatus: WorkStatus[];
  totalAllocatedBudget: number;
  totalUtilizedBudget: number;
  totalRemainingBudget: number;
  budgetsByFy: BudgetByFy[];
  workProgress: WorkProgress[];
  fundDemands: FundDemand[];
  currentFySanctioned: number;
  currentFyRemaining: number;
  lastYearSpill: number;
  totalWorksRecommendedCount: number;
  totalWorksRecommendedCost: number;
  totalWorksSanctionedCount: number;
  totalWorksSanctionedCost: number;
  permissibleScope: number;
  totalFundDisbursed: number;
  worksTable: any[];
}

interface WorkStatus {
  status: string;
  count: number;
}

interface BudgetByFy {
  financialYearId: number;
  financialYear: string;
  allocated: number;
  utilized: number;
  remaining: number;
}

interface WorkProgress {
  workId: number;
  workName: string;
  workCode: string;
  adminApprovedAmount: number;
  utilizedFromDemands: number;
  progressPercent: number;
  status: string;
  nodal: boolean;
}

interface FundDemand {
  id: number;
  demandId: string;
  financialYearId: number;
  financialYear: string;
  workId: number;
  workName: string;
  workCode: string;
  vendorId: number;
  vendorName: string;
  amount: number;
  netPayable: number;
  demandDate: string;
  status: string;
  adminApprovedAmount: number;
  workPortionAmount: number;
}

interface FinancialYear {
  id: number;
  name: string;
}

function MLADashboard() {
  const [dashboardData, setDashboardData] = useState<MLADashboardData | null>(null);
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch financial years dropdown
  const fetchFinancialYears = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/dropdown/financial-years`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setFinancialYears(response.data || []);
    } catch (err: any) {
      console.error('Error fetching financial years:', err);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const params = selectedFinancialYear !== 'all' ? { financialYearId: selectedFinancialYear } : {};
      
      const response = await axios.get(`${baseURL}/api/mla/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedFinancialYear]);

  // Helper functions
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 Crore
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'REJECTED': { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      'IN_PROGRESS': { color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'NOT_STARTED': { color: 'bg-gray-100 text-gray-800', icon: FileText },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING'];
    const IconComponent = config.icon;

    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleExport = () => {
    // Export functionality
    console.log('Export functionality to be implemented');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No dashboard data found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter works based on search term
  const filteredWorks = dashboardData.workProgress.filter(work =>
    work.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.workCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MLA Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your works and fund management</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Fund Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalRemainingBudget)}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.totalWorks}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sanctioned Works</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.totalWorksSanctionedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Awaiting Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalWorksRecommendedCost - dashboardData.totalWorksSanctionedCost)}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
              <Select value={selectedFinancialYear} onValueChange={setSelectedFinancialYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Financial Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Financial Years</SelectItem>
                  {financialYears.map((fy) => (
                    <SelectItem key={fy.id} value={fy.id.toString()}>
                      {fy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search works, IA name, or AA letter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Works Table */}
      <Card>
        <CardHeader>
          <CardTitle>Works Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  <TableHead>Work Name</TableHead>
                  <TableHead>IA Name</TableHead>
                  <TableHead>MLA Letter</TableHead>
                  <TableHead className="text-right">Recommended Amount</TableHead>
                  <TableHead className="text-right">AA Amount</TableHead>
                  <TableHead>AA Letter</TableHead>
                  <TableHead className="text-right">Fund Disbursed</TableHead>
                  <TableHead className="text-right">Pending Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorks.map((work, index) => (
                  <TableRow key={work.workId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
    <div>
                        <p className="font-medium text-sm">{work.workName}</p>
                        <p className="text-xs text-gray-500">{work.workCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">Executive Engineer, Public Works North Division, Pune</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">ML/2425/{work.workId}</span>
                        <ExternalLink className="w-3 h-3 text-blue-500 cursor-pointer" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(work.adminApprovedAmount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(work.adminApprovedAmount)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">Not Assigned</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(work.utilizedFromDemands)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(work.adminApprovedAmount - work.utilizedFromDemands)}
                    </TableCell>
                    <TableCell>{getStatusBadge(work.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredWorks.length === 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No works found
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Allocated</span>
                <span className="font-medium">{formatCurrency(dashboardData.totalAllocatedBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Utilized</span>
                <span className="font-medium">{formatCurrency(dashboardData.totalUtilizedBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Remaining</span>
                <span className="font-medium">{formatCurrency(dashboardData.totalRemainingBudget)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Works Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.worksByStatus.map((status) => (
                <div key={status.status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{status.status.replace('_', ' ')}</span>
                  <Badge variant="secondary">{status.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fund Demands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Demands</span>
                <span className="font-medium">{dashboardData.fundDemands.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-medium">
                  {formatCurrency(dashboardData.fundDemands.reduce((sum, demand) => sum + demand.amount, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Net Payable</span>
                <span className="font-medium">
                  {formatCurrency(dashboardData.fundDemands.reduce((sum, demand) => sum + demand.netPayable, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MLADashboard;
