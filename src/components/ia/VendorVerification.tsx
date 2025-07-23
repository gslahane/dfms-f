
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Search, CheckCircle, XCircle, AlertTriangle, User, CreditCard } from 'lucide-react';

interface VerificationResult {
  aadhaarValid: boolean;
  gstValid: boolean;
  vendorName: string;
  address: string;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  message: string;
}

const VendorVerification = () => {
  const { toast } = useToast();
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleAadhaarVerification = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Please enter a valid 12-digit Aadhaar number.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call to Aadhaar verification service
    setTimeout(() => {
      const mockResult: VerificationResult = {
        aadhaarValid: true,
        gstValid: false,
        vendorName: "Rajesh Kumar Sharma",
        address: "123, MG Road, Mumbai, Maharashtra - 400001",
        message: "Aadhaar verification successful"
      };
      
      setVerificationResult(mockResult);
      setIsVerifying(false);
      
      toast({
        title: "Aadhaar Verified",
        description: "Vendor identity verified successfully.",
      });
    }, 2000);
  };

  const handleGSTVerification = async () => {
    if (!gstNumber || gstNumber.length !== 15) {
      toast({
        title: "Invalid GST Number",
        description: "Please enter a valid 15-character GST number.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call to GST verification service
    setTimeout(() => {
      const mockResult: VerificationResult = {
        aadhaarValid: verificationResult?.aadhaarValid || false,
        gstValid: true,
        vendorName: verificationResult?.vendorName || "OM Nikas",
        address: "Tech Solutions Pvt Ltd, 123, MG Road, Pune, Maharashtra - 400001",
        bankDetails: {
          accountNumber: "89234492472",
          ifsc: "ICIC0001234",
          bankName: "ICICI Bank"
        },
        message: "GST verification successful"
      };
      
      setVerificationResult(mockResult);
      setIsVerifying(false);
      
      toast({
        title: "GST Verified",
        description: "Vendor GST details verified successfully.",
      });
    }, 2000);
  };

  const handleCompleteVerification = () => {
    if (verificationResult?.aadhaarValid && verificationResult?.gstValid) {
      toast({
        title: "Vendor Verification Complete",
        description: "Vendor has been successfully verified and can now receive payments.",
      });
      
      // Reset form
      setAadhaarNumber('');
      setGstNumber('');
      setVerificationResult(null);
    } else {
      toast({
        title: "Incomplete Verification",
        description: "Please complete both Aadhaar and GST verification.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Vendor Verification
          </CardTitle>
          <CardDescription>
            Verify vendor identity using Aadhaar and GST APIs before processing payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Aadhaar Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="aadhaar"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength={12}
                  />
                  <Button
                    onClick={handleAadhaarVerification}
                    disabled={isVerifying || aadhaarNumber.length !== 12}
                    className="whitespace-nowrap"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </div>

              {verificationResult && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {verificationResult.aadhaarValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">Aadhaar Status</span>
                    <Badge variant={verificationResult.aadhaarValid ? "default" : "destructive"}>
                      {verificationResult.aadhaarValid ? 'Verified' : 'Failed'}
                    </Badge>
                  </div>
                  {verificationResult.aadhaarValid && (
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {verificationResult.vendorName}</p>
                      <p><strong>Address:</strong> {verificationResult.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="gst">GST Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="gst"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase().slice(0, 15))}
                    placeholder="Enter 15-character GST number"
                    maxLength={15}
                  />
                  <Button
                    onClick={handleGSTVerification}
                    disabled={isVerifying || gstNumber.length !== 15}
                    className="whitespace-nowrap"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </div>

              {verificationResult && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {verificationResult.gstValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">GST Status</span>
                    <Badge variant={verificationResult.gstValid ? "default" : "destructive"}>
                      {verificationResult.gstValid ? 'Verified' : 'Failed'}
                    </Badge>
                  </div>
                  {verificationResult.gstValid && verificationResult.bankDetails && (
                    <div className="text-sm space-y-1">
                      <p><strong>Business Name:</strong> {verificationResult.vendorName}</p>
                      <p><strong>Bank:</strong> {verificationResult.bankDetails.bankName}</p>
                      <p><strong>Account:</strong> {verificationResult.bankDetails.accountNumber}</p>
                      <p><strong>IFSC:</strong> {verificationResult.bankDetails.ifsc}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Complete Verification */}
          {verificationResult && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Verification Status:</span>
                    {verificationResult.aadhaarValid && verificationResult.gstValid ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Incomplete
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  onClick={handleCompleteVerification}
                  disabled={!verificationResult.aadhaarValid || !verificationResult.gstValid}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Verification
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Enter the vendor's 12-digit Aadhaar number for identity verification</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Enter the vendor's 15-character GST number for business verification</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Both verifications must be successful before the vendor can receive payments</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Bank details will be automatically fetched from GST portal upon successful verification</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorVerification;
