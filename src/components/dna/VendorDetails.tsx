
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Mail, Phone, MapPin, CreditCard, FileText, Star } from 'lucide-react';
import { Vendor } from './VendorVerification';

interface VendorDetailsProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (vendorId: string, status: 'Verified' | 'Rejected', remarks?: string) => void;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({
  vendor,
  isOpen,
  onClose,
  onVerify
}) => {
  const [remarks, setRemarks] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!vendor) return null;

  const handleVerification = async (status: 'Verified' | 'Rejected') => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    onVerify(vendor.id, status, remarks);
    setIsVerifying(false);
    setRemarks('');
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-orange-100 text-orange-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Vendor Details - {vendor.name}
            </DialogTitle>
            <Badge className={getStatusColor(vendor.verificationStatus)}>
              {vendor.verificationStatus}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="bank">Bank Info</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Vendor Name</Label>
                    <p className="font-medium">{vendor.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Type</Label>
                    <p>{vendor.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <p>{vendor.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Person</Label>
                    <p>{vendor.contactPerson || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Registration Date</Label>
                    <p>{new Date(vendor.registrationDate).toLocaleDateString()}</p>
                  </div>
                  {vendor.rating && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Rating</Label>
                      {renderStars(vendor.rating)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p>{vendor.address}</p>
                      <p>{vendor.city}, {vendor.state} - {vendor.pincode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">GST Number</Label>
                    <p className="font-mono">{vendor.gstNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">PAN Number</Label>
                    <p className="font-mono">{vendor.panNumber}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Work Experience</Label>
                    <p>{vendor.workExperience || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Annual Turnover</Label>
                    <p>{vendor.annualTurnover || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
                <CardDescription>
                  Documents provided by the vendor during registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vendor.documentsSubmitted.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {vendor.documentsSubmitted.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50"
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No documents submitted</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vendor.bankDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                      <p>{vendor.bankDetails.bankName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Holder Name</Label>
                      <p>{vendor.bankDetails.accountHolderName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                      <p className="font-mono">{vendor.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">IFSC Code</Label>
                      <p className="font-mono">{vendor.bankDetails.ifscCode}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No bank details provided</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                    <Badge className={getStatusColor(vendor.verificationStatus)}>
                      {vendor.verificationStatus}
                    </Badge>
                  </div>
                  {vendor.verificationDate && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Verification Date</Label>
                      <p>{new Date(vendor.verificationDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {vendor.verifiedBy && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Verified By</Label>
                    <p>{vendor.verifiedBy}</p>
                  </div>
                )}

                {vendor.remarks && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Remarks</Label>
                    <p className="p-3 bg-gray-50 rounded-lg">{vendor.remarks}</p>
                  </div>
                )}

                {vendor.verificationStatus === 'Pending' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="remarks">Verification Remarks</Label>
                      <Textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter verification remarks..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVerification('Verified')}
                        disabled={isVerifying}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isVerifying ? 'Verifying...' : 'Verify Vendor'}
                      </Button>
                      <Button
                        onClick={() => handleVerification('Rejected')}
                        disabled={isVerifying}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {isVerifying ? 'Rejecting...' : 'Reject Vendor'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetails;
