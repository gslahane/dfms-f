import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, MapPin, Building, CreditCard, Calendar, Star } from 'lucide-react';
import { Vendor } from './VendorList'; // Import the interface

interface VendorDetailsProps {
  vendor: Vendor;
  onBack: () => void;
  formatCurrency: (amount: number | null) => string;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onBack, formatCurrency }) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 py-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{vendor.name || "N/A"}</h1>
          <p className="text-gray-600">Vendor Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Company Name</span>
              <p className="text-sm mt-1">{vendor.name || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Type</span>
                <p className="text-sm mt-1">{vendor.type || "-"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Category</span>
                <p className="text-sm mt-1">{vendor.category || "-"}</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status</span>
              <div className="mt-1">
                <Badge className={getStatusColor(vendor.status)}>{vendor.status || "N/A"}</Badge>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Performance Rating</span>
              <div className="flex items-center mt-1">
                <span className="text-sm font-medium">{vendor.performanceRating != null ? vendor.performanceRating : "-"}</span>
                <Star className="h-4 w-4 text-yellow-500 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Contact Person</span>
              <p className="text-sm mt-1">{vendor.contactPerson || "-"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Phone</span>
              <p className="text-sm mt-1 flex items-center gap-2">
                {vendor.phone || "-"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-sm mt-1 flex items-center gap-2">
                {vendor.email || "-"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Address</span>
              <p className="text-sm mt-1 flex items-start gap-2">
                <MapPin className="h-3 w-3 mt-1" />
                <span>
                  {vendor.address || "-"}<br />
                  {vendor.city || "-"}, {vendor.state || "-"} - {vendor.pincode || "-"}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Legal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-sm font-medium text-gray-500">GST Number</span>
              <p className="text-sm mt-1 font-mono">{vendor.gstNumber || "-"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">PAN Number</span>
              <p className="text-sm mt-1 font-mono">{vendor.panNumber || "-"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Registration Date</span>
              <p className="text-sm mt-1 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {vendor.registrationDate
                  ? new Date(vendor.registrationDate).toLocaleDateString('en-IN')
                  : "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Bank Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-medium text-gray-500">Account Number</span>
              <p className="text-sm mt-1 font-mono">{vendor.bankAccountNumber || "-"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">IFSC Code</span>
              <p className="text-sm mt-1 font-mono">{vendor.bankIfsc || "-"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Bank Name</span>
              <p className="text-sm mt-1">{vendor.bankName || "-"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Branch</span>
              <p className="text-sm mt-1">{vendor.bankBranch || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Info */}
      <div className="text-sm text-gray-600">
        <p>
          Last updated on {vendor.lastUpdated ? new Date(vendor.lastUpdated).toLocaleDateString('en-IN') : "-"}
          {vendor.updatedBy && <> by {vendor.updatedBy}</>}
        </p>
      </div>
    </div>
  );
};

export default VendorDetails;
