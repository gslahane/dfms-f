import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Search, Filter, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VendorDetails from './VendorDetails';

export interface Vendor {
  id: string;
  name: string;
  aadhaarNumber: string;
  gstNumber: string;
  panNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  aadhaarVerified: boolean;
  gstVerified: boolean;
  type: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  performanceRating: number;
  creditLimit: string;
  paymentTerms: string;
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branch: string;
  };
  documents: Array<{
    name: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    uploadDate: string;
  }>;
  contracts: Array<{
    id: string;
    name: string;
    status: 'Active' | 'Completed' | 'Terminated';
    startDate: string;
    endDate: string;
    value: string;
  }>;
  paymentEligible: boolean;
  lastUpdated: string;
  updatedBy: string;
}

const VendorList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN').format(parseFloat(amount));
  };

  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'OM Infra PVT LTD',
      aadhaarNumber: '1234-5678-9012',
      gstNumber: '27ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      contactPerson: 'Om Nikas ',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
      address: '123 MG Road, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      registrationDate: '2024-01-15',
      verificationStatus: 'Verified',
      aadhaarVerified: true,
      gstVerified: true,
      type: 'Individual',
      category: 'Construction',
      status: 'Active',
      performanceRating: 4.5,
      creditLimit: '1000000',
      paymentTerms: 'Net 30',
      bankDetails: {
        accountNumber: '1234567890',
        ifsc: 'ICIC0001234',
        bankName: 'ICICI Bank',
        branch: 'Bandra Branch'
      },
      documents: [
        {
          name: 'Aadhaar Card',
          status: 'Verified',
          uploadDate: '2024-01-15'
        },
        {
          name: 'GST Certificate',
          status: 'Verified',
          uploadDate: '2024-01-15'
        },
        {
          name: 'Bank Statement',
          status: 'Verified',
          uploadDate: '2024-01-15'
        }
      ],
      contracts: [
        {
          id: 'C001',
          name: 'Road Construction Project',
          status: 'Active',
          startDate: '2024-01-15',
          endDate: '2024-12-31',
          value: '5000000'
        }
      ],
      paymentEligible: true,
      lastUpdated: '2024-01-15',
      updatedBy: 'IA Officer'
    }  ]);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.aadhaarNumber.includes(searchTerm) ||
    vendor.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDetails(true);
  };

  const handleEdit = (vendor: Vendor) => {
    toast({
      title: "Edit Vendor",
      description: `Edit functionality for ${vendor.name} will be implemented.`,
    });
  };

  const handleDelete = (vendorId: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      toast({
        title: "Vendor Deleted",
        description: "Vendor has been removed from the system.",
        variant: "destructive"
      });
    }
  };

  if (showDetails && selectedVendor) {
    return (
      <VendorDetails
        vendor={selectedVendor}
        onBack={() => setShowDetails(false)}
        formatCurrency={formatCurrency}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor List</CardTitle>
        <CardDescription>Manage verified vendors eligible for payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, Aadhaar, GST number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Details</TableHead>
                <TableHead>Aadhaar Number</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Verification Status</TableHead>
                <TableHead>Payment Eligible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-gray-500">
                        {vendor.contactPerson}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vendor.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{vendor.aadhaarNumber}</span>
                      {vendor.aadhaarVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{vendor.gstNumber}</span>
                      {vendor.gstVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vendor.verificationStatus)}>
                      {vendor.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={vendor.paymentEligible ? "default" : "secondary"}
                      className={vendor.paymentEligible ? "bg-green-100 text-green-800" : ""}
                    >
                      {vendor.paymentEligible ? 'Eligible' : 'Not Eligible'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(vendor)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vendor)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vendor.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No vendors found matching your search criteria</p>
            <p className="text-sm">Add verified vendors to start processing payments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorList;
