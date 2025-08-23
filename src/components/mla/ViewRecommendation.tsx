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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Download,
  ExternalLink,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

// Types for the API response
interface Recommendation {
  id: number;
  workName: string;
  workCode: string;
  iaName: string;
  mlaLetter: string;
  recommendedAmount: number;
  aaAmount: number;
  aaLetter: string;
  fundDisbursed: number;
  pendingAmount: number;
  status: string;
  financialYear: string;
  scheme: string;
  sector: string;
  createdAt: string;
}

interface FinancialYear {
  id: number;
  name: string;
}

interface ImplementingAgency {
  id: number;
  name: string;
  code: string;
}

interface Sector {
  id: number;
  name: string;
}

interface Scheme {
  id: number;
  name: string;
}

// Form schema
const formSchema = z.object({
  financialYear: z.string().min(1, 'Please select financial year'),
  implementingAgency: z.string().min(1, 'Please select implementing agency'),
  workName: z.string().min(1, 'Work name is required'),
  recommendedWorkAmount: z.number().min(1, 'Amount must be greater than 0'),
  scheme: z.string().min(1, 'Please select scheme'),
  recommendationLetter: z.any().optional(),
});

function MLAViewRecommendation() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [implementingAgencies, setImplementingAgencies] = useState<ImplementingAgency[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financialYear: '',
      implementingAgency: '',
      workName: '',
      recommendedWorkAmount: 0,
      scheme: '',
    },
  });

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch financial years
      const fyResponse = await axios.get(`${baseURL}/api/dropdown/financial-years`, { headers });
      setFinancialYears(fyResponse.data || []);

      // Fetch implementing agencies (divisions)
      const iaResponse = await axios.get(`${baseURL}/api/dropdown/divisions`, { headers });
      setImplementingAgencies(iaResponse.data || []);

      // Fetch sectors
      const sectorResponse = await axios.get(`${baseURL}/api/dropdown/sectors`, { headers });
      setSectors(sectorResponse.data || []);

      // Fetch schemes
      const schemeResponse = await axios.get(`${baseURL}/api/dropdown/schemes`, { headers });
      setSchemes(schemeResponse.data || []);

    } catch (err: any) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const params = selectedFinancialYear !== 'all' ? { financialYearId: selectedFinancialYear } : {};
      
      const response = await axios.get(`${baseURL}/api/mla/recommendations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      });
      
      setRecommendations(response.data || []);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.response?.data?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchRecommendations();
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
      'IN_PROGRESS': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'NOT_STARTED': { color: 'bg-gray-100 text-gray-800', icon: Clock },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('recommendationLetter', file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmittedData(values);
      setShowConfirmation(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to prepare form data",
        variant: "destructive"
      });
    }
  };

  const handleConfirmSubmission = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append('financialYearId', submittedData.financialYear);
      formData.append('implementingAgencyId', submittedData.implementingAgency);
      formData.append('workName', submittedData.workName);
      formData.append('recommendedWorkAmount', submittedData.recommendedWorkAmount.toString());
      formData.append('schemeId', submittedData.scheme);
      
      if (submittedData.recommendationLetter) {
        formData.append('recommendationLetter', submittedData.recommendationLetter);
      }

      const response = await axios.post(`${baseURL}/api/works/recommend/mla`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Work recommendation submitted successfully",
        });
        
        // Reset form and close modal
        setShowModal(false);
        setShowConfirmation(false);
        form.reset();
        setFileName('');
        setSubmittedData(null);
        
        // Refresh recommendations
        fetchRecommendations();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to submit recommendation",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit recommendation",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log('Export functionality to be implemented');
  };

  // Filter recommendations based on search term
  const filteredRecommendations = recommendations.filter(rec =>
    rec.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.workCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.iaName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">Loading recommendations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MLA Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage work recommendations</p>
        </div>
        <Button onClick={fetchRecommendations} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Recommend New Work Section */}
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommend New Work</h2>
          <p className="text-gray-600 mb-6">Submit new work recommendations for approval and budget allocation.</p>
          <Button onClick={() => setShowModal(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            + Recommend New Work
          </Button>
        </CardContent>
      </Card>

      {/* Recent Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
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

          {/* Recommendations Table */}
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
                {filteredRecommendations.map((rec, index) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{rec.workName}</p>
                        <p className="text-xs text-gray-500">{rec.workCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{rec.iaName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3 text-blue-500" />
                        <span className="text-sm">{rec.mlaLetter}</span>
                        <ExternalLink className="w-3 h-3 text-blue-500 cursor-pointer" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(rec.recommendedAmount)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(rec.aaAmount)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {rec.aaLetter || 'Not Assigned'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(rec.fundDisbursed)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(rec.pendingAmount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(rec.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredRecommendations.length === 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No recommendations found
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {!showConfirmation ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Recommend New Work</DialogTitle>
                <DialogDescription>
                  Submit a new work recommendation for approval and budget allocation.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="financialYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Financial Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Financial Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {financialYears.map((fy) => (
                                <SelectItem key={fy.id} value={fy.id.toString()}>
                                  {fy.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="implementingAgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Implementing Agency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select IA" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {implementingAgencies.map((ia) => (
                                <SelectItem key={ia.id} value={ia.id.toString()}>
                                  {ia.name} ({ia.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="workName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Name</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter detailed work description"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recommendedWorkAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommended Work Amount (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="Enter amount"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scheme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Scheme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {schemes.map((scheme) => (
                                <SelectItem key={scheme.id} value={scheme.id.toString()}>
                                  {scheme.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="recommendationLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MLA Recommendation Letter</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                              id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <div className="flex flex-col items-center space-y-2">
                                {fileName ? (
                                  <>
                                    <FileText className="h-8 w-8 text-primary" />
                                    <span className="text-sm font-medium">{fileName}</span>
                                    <span className="text-xs text-muted-foreground">Click to change file</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      Click to upload recommendation letter
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      PDF, DOC, DOCX up to 10MB
                                    </span>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">MLA Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <div className="font-medium">Shri Dilip Dattatray Walse</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Constituency:</span>
                        <div className="font-medium">Ambegaon Assembly Constituency</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Submit Recommendation
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Confirm Submission</DialogTitle>
                <DialogDescription>
                  Please review your work recommendation details before final submission.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Work Recommendation Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Financial Year:</span>
                      <div className="font-medium">
                        {financialYears.find(fy => fy.id.toString() === submittedData?.financialYear)?.name}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Implementing Agency:</span>
                      <div className="font-medium">
                        {implementingAgencies.find(ia => ia.id.toString() === submittedData?.implementingAgency)?.name}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <div className="font-medium">{formatCurrency(submittedData?.recommendedWorkAmount || 0)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Scheme:</span>
                      <div className="font-medium">
                        {schemes.find(s => s.id.toString() === submittedData?.scheme)?.name}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Work Name:</span>
                    <div className="font-medium">{submittedData?.workName}</div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">MLA Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <div className="font-medium">Shri Dilip Dattatray Walse</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Constituency:</span>
                      <div className="font-medium">Ambegaon Assembly Constituency</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
                    Back to Edit
                  </Button>
                  <Button onClick={handleConfirmSubmission}>
                    Confirm & Submit
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MLAViewRecommendation;
