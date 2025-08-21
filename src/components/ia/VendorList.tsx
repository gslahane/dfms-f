import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Search, Filter, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import VendorDetails from './VendorDetails';

export interface Vendor {
  id: number;
  name: string | null;
  aadhaarNumber: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  registrationDate: string | null;
  verificationStatus: string | null;
  aadhaarVerified: boolean | null;
  gstVerified: boolean | null;
  type: string | null;
  category: string | null;
  status: string | null;
  performanceRating: number | null;
  creditLimit: number | null;
  paymentTerms: string | null;
  bankAccountNumber: string | null;
  bankIfsc: string | null;
  bankName: string | null;
  bankBranch: string | null;
  documentUrls: string[];
  paymentEligible: boolean | null;
  lastUpdated: string | null;
  updatedBy: string | null;
  createdAt: string | null;
  createdBy: string | null;
}

const VendorList = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // For notification-based confirm
  const confirmToastId = useRef<string | null>(null);

  // Fetch vendor data on mount
  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.get(`${baseURL}/api/vendors`);
      setVendors(res.data || []);
    } catch {
      toast({
        title: "Failed to Load",
        description: "Could not fetch vendor data.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "0";
    return new Intl.NumberFormat('en-IN').format(Number(amount));
  };

  const filteredVendors = vendors.filter((vendor) =>
    (vendor.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.aadhaarNumber || '').includes(searchTerm) ||
    (vendor.gstNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
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
      description: `Edit functionality for ${vendor.name || "Vendor"} will be implemented.`,
    });
  };

  // Notification-based Delete Confirmation
const handleDelete = (vendorId: number, vendorName: string | null) => {
  toast({
    title: "Delete Vendor?",
    description: (
      <div>
        <div className="mb-2">
          Are you sure you want to delete <span className="font-semibold">{vendorName || "Vendor"}</span>?
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={async (e) => {
              // Confirm deletion
              try {
                const baseURL = import.meta.env.VITE_API_BASE_URL;
                await axios.delete(`${baseURL}/api/vendors/delete/${vendorId}`);
                toast({
                  title: "Vendor Deleted",
                  description: "Vendor has been removed from the system.",
                  variant: "destructive"
                });
                setVendors(prev => prev.filter(v => v.id !== vendorId));
              } catch {
                toast({
                  title: "Delete Failed",
                  description: "Could not delete vendor.",
                  variant: "destructive"
                });
              }
            }}
          >
            Yes, Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            style={{
              borderColor: "#bbb",
              color: "#1a1a1a",
              background: "#fff"
            }}
            onClick={() => {
              /* No need for toast.dismiss -- closing the toast is handled by Sonner automatically on action click, or simply do nothing here */
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    variant: "destructive",
    duration: 999999, // Keeps it open until action
  });
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <span className="ml-3">Loading vendors...</span>
      </div>
    );
  }

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
        <CardDescription>Manage registered vendors eligible for payments</CardDescription>
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
              {filteredVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    No vendors found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
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
                      {vendor.verificationStatus || "Pending"}
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
                        onClick={() => handleDelete(vendor.id, vendor.name)}
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
      </CardContent>
    </Card>
  );
};

export default VendorList;
