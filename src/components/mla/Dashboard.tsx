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
  User, 
  MapPin, 
  Calendar,
  Banknote,
  FileCheck2,
  CheckCircle2,
  Target,
  Search,
  Download,
  ExternalLink,
  FileText,
  AlertCircle,
  RefreshCw,
  Eye
} from 'lucide-react';

// Types for the API response based on the provided structure
interface Work {
  id: number;
  workName: string;
  workCode: string;
  adminApprovedAmount: number;
  adminApprovedletterUrl: string;
  workPortionTax: number;
  workPortionAmount: number;
  workOrderLetterUrl: string;
  financialYear: string;
  workStartDate: string;
  workEndDate: string;
  sanctionDate: string;
  grossAmount: number;
  balanceAmount: number;
  description: string;
  remark: string;
  status: string;
  createdAt: string;
  createdBy: string;
  scheme: {
    id: number;
    schemeName: string;
    schemeCode: string;
    description: string;
  };
  implementingAgency: {
    id: number;
    fullname: string;
    designation: string;
    district: {
      id: number;
      districtName: string;
    };
  };
  recommendedByMla: {
    id: number;
    mlaName: string;
    party: string;
    term: number;
    constituency: {
      id: number;
      constituencyName: string;
    };
  };
  district: {
    id: number;
    districtName: string;
  };
}

interface FinancialYear {
  id: number;
  name: string;
}

interface MLABudget {
  id: number;
  mlaId: number;
  financialYearId: number;
  allocatedBudget: number;
  utilizedBudget: number;
  remainingBudget: number;
  lastYearSpill: number;
  permissibleScope: number;
  createdAt: string;
  updatedAt: string;
}

interface MLAInfo {
  mlaName: string;
  constituency: string;
  tenure: string;
  totalLimit: number;
}

function MLADashboard() {
  const [works, setWorks] = useState<Work[]>([]);
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>('2024-25');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mlaBudget, setMlaBudget] = useState<MLABudget | null>(null);
  
  // Mock MLA info - this should come from user context or API
  const mlaInfo: MLAInfo = {
    mlaName: "Shri Dilip Dattatray Walse",
    constituency: "Ambegaon Assembly Constituency",
    tenure: "2024-2029",
    totalLimit: 25 // in crores
  };

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

  // Fetch MLA budget data
  const fetchMLABudget = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/mla-budget/getMLABudgets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMlaBudget(response.data || null);
    } catch (err: any) {
      console.error('Error fetching MLA budget:', err);
      // Don't set error for budget fetch failure, just use defaults
    }
  };

  // Fetch works data
  const fetchWorksData = async () => {
    try {
      setLoading(true);
      setError(null);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/works`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setWorks(response.data || []);
    } catch (err: any) {
      console.error('Error fetching works data:', err);
      setError(err.response?.data?.message || 'Failed to fetch works data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    fetchWorksData();
  }, []);

  useEffect(() => {
    fetchMLABudget();
  }, []);

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
            <Button onClick={fetchWorksData} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate dashboard metrics
  const currentFyWorks = works.filter(work => work.financialYear === selectedFinancialYear);
  const recommendedWorks = currentFyWorks.filter(work => work.status === 'RECOMMENDED' || work.status === 'PENDING');
  const sanctionedWorks = currentFyWorks.filter(work => work.status === 'APPROVED' || work.status === 'SANCTIONED');
  
  // Use budget data from API if available, otherwise calculate from works
  const currentFyBudgetSanctioned = mlaBudget?.allocatedBudget || sanctionedWorks.reduce((sum, work) => sum + work.adminApprovedAmount, 0);
  const totalWorksRecommendedCost = recommendedWorks.reduce((sum, work) => sum + work.grossAmount, 0);
  const totalWorksSanctionedCost = sanctionedWorks.reduce((sum, work) => sum + work.adminApprovedAmount, 0);
  const remainingBalance = mlaBudget?.remainingBudget || (currentFyBudgetSanctioned - totalWorksSanctionedCost);
  const lastYearSpill = mlaBudget?.lastYearSpill || 50; // Use API data or fallback
  const permissibleScope = mlaBudget?.permissibleScope || ((mlaInfo.totalLimit * 10000000) - remainingBalance);
  
  // Filter works based on search term
  const filteredWorks = works.filter(work =>
    work.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.workCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.implementingAgency?.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MLA Dashboard</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {mlaInfo.mlaName}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {mlaInfo.constituency}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Tenure: {mlaInfo.tenure}
                </div>
                <div className="flex items-center">
                  <Banknote className="w-4 h-4 mr-1" />
                  Total Limit: ₹{mlaInfo.totalLimit} Crores
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 mt-2">
                Active Session
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Search and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={selectedFinancialYear} onValueChange={setSelectedFinancialYear}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Financial Year" />
              </SelectTrigger>
              <SelectContent>
                {financialYears.map((fy) => (
                  <SelectItem key={fy.id} value={fy.name}>
                    {fy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search works, IA name, or AA letter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-96"
              />
            </div>
          </div>
          
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Banknote className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Current FY Budget Sanctioned</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentFyBudgetSanctioned)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Remaining Balance: {formatCurrency(remainingBalance)} | Last Year Spill: {formatCurrency(lastYearSpill)}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">View</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FileCheck2 className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Total Works Recommended</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{recommendedWorks.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Work Cost: {formatCurrency(totalWorksRecommendedCost)}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">View</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Total Works Sanctioned</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{sanctionedWorks.length}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Cost of Sanctioned Works: {formatCurrency(totalWorksSanctionedCost)}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">View</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-600">Permissible Scope</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(permissibleScope)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Remaining Scope: {formatCurrency(permissibleScope - totalWorksRecommendedCost)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Works Table */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-semibold">Sr No</TableHead>
                  <TableHead className="font-semibold">Work Name</TableHead>
                  <TableHead className="font-semibold">IA Name</TableHead>
                  <TableHead className="font-semibold">MLA Letter</TableHead>
                  <TableHead className="text-right font-semibold">Recommended Amount</TableHead>
                  <TableHead className="text-right font-semibold">AA Amount</TableHead>
                  <TableHead className="font-semibold">AA Letter</TableHead>
                  <TableHead className="text-right font-semibold">Fund Disbursed</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorks.map((work, index) => (
                  <TableRow key={work.id} className="hover:bg-gray-50">
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{work.workName}</p>
                        <p className="text-xs text-gray-500">FY: {work.financialYear}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{work.implementingAgency?.fullname || 'Executive Engineer, Public Works North Division, Pune'}</p>
                        <p className="text-xs text-gray-500">{work.implementingAgency?.designation || 'Executive Engineer'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">ML/2425/{work.id}</span>
                        <ExternalLink className="w-3 h-3 text-blue-500 cursor-pointer hover:text-blue-700" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(work.grossAmount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(work.adminApprovedAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">AA/2024/001</span>
                        <ExternalLink className="w-3 h-3 text-blue-500 cursor-pointer hover:text-blue-700" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      ₹0.0
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          work.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          work.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {work.status === 'APPROVED' ? 'Not Started' : work.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredWorks.length === 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No works found
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

export default MLADashboard;
