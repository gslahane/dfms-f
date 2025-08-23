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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight,
  FileText,
  Hammer,
  DollarSign,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Types for the API response
interface VendorDashboardData {
  totalDemands: number;
  pendingDemands: number;
  rejectedDemands: number;
  approvedByStateDemands: number;
  transferredDemands: number;
  totalGrossDemanded: number;
  totalNetDemanded: number;
  totalTransferred: number;
  totalWorks: number;
  worksByStatus: {
    [key: string]: number;
  };
  demands: Demand[];
  works: Work[];
}

interface Demand {
  id: number;
  demandId: string;
  financialYearId: number;
  financialYear: string;
  workId: number;
  workCode: string;
  workName: string;
  schemeId: number;
  schemeName: string;
  districtId: number;
  districtName: string;
  demandDate: string;
  grossAmount: number;
  netPayable: number;
  status: string;
  paymentRefNo: string;
  voucherNo: string;
}

interface Work {
  workId: number;
  workCode: string;
  workName: string;
  status: string;
  adminApprovedAmount: number;
  balanceAmount: number;
  schemeId: number;
  schemeName: string;
  districtId: number;
  districtName: string;
  iaUserId: number;
  iaUsername: string;
  iaFullname: string;
}

function VendorDashboard() {
  const [dashboardData, setDashboardData] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      
      // Get token from localStorage for debugging
      const token = localStorage.getItem("token");
      console.log('Token available:', !!token);
      console.log('Base URL:', baseURL);
      console.log('Using token:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Try multiple endpoint variations
      let response;
      let lastError;
      
      // Try the original endpoint first
      try {
        const requestURL = `${baseURL}/api/vendor/dashboard`;
        const requestHeaders = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        console.log('Trying endpoint 1:', requestURL);
        console.log('Request Headers:', requestHeaders);
        
        response = await axios.get(requestURL, {
          headers: requestHeaders
        });
        console.log('Success with endpoint 1!');
      } catch (error1: any) {
        console.log('Endpoint 1 failed:', error1.response?.status);
        lastError = error1;
        
        // Try the vendors endpoint (plural)
        try {
          const requestURL2 = `${baseURL}/api/vendors/dashboard`;
          console.log('Trying endpoint 2:', requestURL2);
          
          response = await axios.get(requestURL2, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Success with endpoint 2!');
        } catch (error2: any) {
          console.log('Endpoint 2 failed:', error2.response?.status);
          lastError = error2;
          
                     // Try without /dashboard suffix
           try {
             const requestURL3 = `${baseURL}/api/vendor`;
             console.log('Trying endpoint 3:', requestURL3);
             
             response = await axios.get(requestURL3, {
               headers: {
                 'Authorization': `Bearer ${token}`,
                 'Content-Type': 'application/json'
               }
             });
             console.log('Success with endpoint 3!');
           } catch (error3: any) {
             console.log('Endpoint 3 failed:', error3.response?.status);
             lastError = error3;
             
             // Try without Bearer prefix
             try {
               const requestURL4 = `${baseURL}/api/vendor/dashboard`;
               console.log('Trying endpoint 4 (no Bearer):', requestURL4);
               
               response = await axios.get(requestURL4, {
                 headers: {
                   'Authorization': token,
                   'Content-Type': 'application/json'
                 }
               });
               console.log('Success with endpoint 4!');
             } catch (error4: any) {
               console.log('All endpoints failed');
               throw lastError; // Throw the first error
             }
           }
        }
      }
      setDashboardData(response.data);
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 403) {
        setError('Access forbidden. Please check your authentication token.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'REJECTED': { color: 'bg-red-100 text-red-800', icon: XCircle },
      'TRANSFERRED': { color: 'bg-blue-100 text-blue-800', icon: ArrowUpRight },
      'APPROVED_BY_STATE': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
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

  const getWorkStatusBadge = (status: string) => {
    const statusConfig = {
      'IN_PROGRESS': { color: 'bg-blue-100 text-blue-800', icon: Hammer },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'ON_HOLD': { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
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

  // Calculate additional metrics
  const totalDemands = dashboardData.totalDemands;
  const totalWorks = dashboardData.totalWorks;
  const totalGrossAmount = dashboardData.totalGrossDemanded;
  const totalNetAmount = dashboardData.totalNetDemanded;
  const totalTransferred = dashboardData.totalTransferred;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your demands and works</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
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
                  <p className="text-sm font-medium text-gray-600">Total Demands</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDemands}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
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
                  <p className="text-sm font-medium text-gray-600">Total Works</p>
                  <p className="text-2xl font-bold text-gray-900">{totalWorks}</p>
                </div>
                <Hammer className="w-8 h-8 text-green-500" />
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
                  <p className="text-sm font-medium text-gray-600">Gross Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGrossAmount)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
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
                  <p className="text-sm font-medium text-gray-600">Net Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalNetAmount)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-xl font-bold text-yellow-900">{dashboardData.pendingDemands}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Approved</p>
                <p className="text-xl font-bold text-green-900">{dashboardData.approvedByStateDemands}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Rejected</p>
                <p className="text-xl font-bold text-red-900">{dashboardData.rejectedDemands}</p>
              </div>
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Transferred</p>
                <p className="text-xl font-bold text-blue-900">{dashboardData.transferredDemands}</p>
              </div>
              <ArrowUpRight className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Total Transferred</p>
                <p className="text-xl font-bold text-purple-900">{formatCurrency(totalTransferred)}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Demands and Works */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Demands Overview</TabsTrigger>
          <TabsTrigger value="works">Works Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Demands Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Demand ID</TableHead>
                      <TableHead>Work Details</TableHead>
                      <TableHead>Scheme</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Demand Date</TableHead>
                      <TableHead className="text-right">Gross Amount</TableHead>
                      <TableHead className="text-right">Net Payable</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Ref</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.demands.map((demand) => (
                      <TableRow key={demand.id}>
                        <TableCell className="font-medium">{demand.demandId}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{demand.workName}</p>
                            <p className="text-xs text-gray-500">{demand.workCode}</p>
                          </div>
                        </TableCell>
                        <TableCell>{demand.schemeName}</TableCell>
                        <TableCell>{demand.districtName}</TableCell>
                        <TableCell>{formatDate(demand.demandDate)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(demand.grossAmount)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(demand.netPayable)}
                        </TableCell>
                        <TableCell>{getStatusBadge(demand.status)}</TableCell>
                        <TableCell>
                          {demand.paymentRefNo ? (
                            <span className="text-sm text-gray-600">{demand.paymentRefNo}</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {dashboardData.demands.length === 0 && (
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No demands found
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="works" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="w-5 h-5" />
                Works Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Code</TableHead>
                      <TableHead>Work Name</TableHead>
                      <TableHead>Scheme</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>IA Details</TableHead>
                      <TableHead className="text-right">Approved Amount</TableHead>
                      <TableHead className="text-right">Balance Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.works.map((work) => (
                      <TableRow key={work.workId}>
                        <TableCell className="font-medium">{work.workCode}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{work.workName}</p>
                          </div>
                        </TableCell>
                        <TableCell>{work.schemeName}</TableCell>
                        <TableCell>{work.districtName}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{work.iaFullname}</p>
                            <p className="text-xs text-gray-500">{work.iaUsername}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(work.adminApprovedAmount)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(work.balanceAmount)}
                        </TableCell>
                        <TableCell>{getWorkStatusBadge(work.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {dashboardData.works.length === 0 && (
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No works found
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Works by Status Summary */}
      {Object.keys(dashboardData.worksByStatus).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Works by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(dashboardData.worksByStatus).map(([status, count]) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">{status.replace('_', ' ')}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default VendorDashboard;
