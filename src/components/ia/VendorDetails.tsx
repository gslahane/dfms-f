
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  CreditCard, 
  FileText, 
  Calendar,
  Star,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Vendor } from './VendorList';

interface VendorDetailsProps {
  vendor: Vendor;
  onBack: () => void;
  formatCurrency: (amount: string) => string;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onBack, formatCurrency }) => {
  const getStatusColor = (status: string) => {
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

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{vendor.name}</h1>
          <p className="text-gray-600">Vendor Details</p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Company Name</label>
              <p className="text-sm mt-1">{vendor.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-sm mt-1">{vendor.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-sm mt-1">{vendor.category}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Performance Rating</label>
              <div className="flex items-center mt-1">
                <span className="text-sm font-medium">{vendor.performanceRating}</span>
                <Star className="h-4 w-4 text-yellow-500 ml-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Person</label>
              <p className="text-sm mt-1">{vendor.contactPerson}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-sm mt-1 flex items-center gap-2">
                <Phone className="h-3 w-3" />
                {vendor.phone}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm mt-1 flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {vendor.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-sm mt-1 flex items-start gap-2">
                <MapPin className="h-3 w-3 mt-1" />
                <span>
                  {vendor.address}<br />
                  {vendor.city}, {vendor.state} - {vendor.pincode}
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
            <FileText className="h-5 w-5" />
            Legal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">GST Number</label>
              <p className="text-sm mt-1 font-mono">{vendor.gstNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">PAN Number</label>
              <p className="text-sm mt-1 font-mono">{vendor.panNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Registration Date</label>
              <p className="text-sm mt-1 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {new Date(vendor.registrationDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Credit Limit</label>
              <p className="text-lg font-semibold text-green-600 mt-1">₹{formatCurrency(vendor.creditLimit)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Payment Terms</label>
              <p className="text-sm mt-1">{vendor.paymentTerms}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Account Number</label>
              <p className="text-sm mt-1 font-mono">{vendor.bankDetails.accountNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">IFSC Code</label>
              <p className="text-sm mt-1 font-mono">{vendor.bankDetails.ifsc}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bank Name</label>
              <p className="text-sm mt-1">{vendor.bankDetails.bankName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Branch</label>
              <p className="text-sm mt-1">{vendor.bankDetails.branch}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendor.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getDocumentStatusIcon(doc.status)}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded: {new Date(doc.uploadDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <Badge className={`${
                  doc.status === 'Verified' ? 'bg-green-100 text-green-800' :
                  doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {doc.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendor.contracts.map((contract) => (
              <div key={contract.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{contract.name}</h4>
                  <Badge className={getContractStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Start Date:</span>
                    <p>{new Date(contract.startDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">End Date:</span>
                    <p>{new Date(contract.endDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Value:</span>
                    <p className="font-semibold">₹{formatCurrency(contract.value)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Update Information */}
      <div className="text-sm text-gray-600">
        <p>Last updated on {new Date(vendor.lastUpdated).toLocaleDateString('en-IN')} by {vendor.updatedBy}</p>
      </div>
    </div>
  );
};

export default VendorDetails;
