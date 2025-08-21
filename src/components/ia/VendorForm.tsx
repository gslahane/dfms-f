// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';
// import { Save, X, Shield, CheckCircle } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import axios from 'axios';
// import { useAuth } from '@/contexts/AuthContext';

// interface VendorFormProps {
//   onCancel: () => void;
//   onSubmit: () => void;
// }

// const VendorForm: React.FC<VendorFormProps> = ({ onCancel, onSubmit }) => {
//   const { toast } = useToast();
//   const { user } = useAuth();

//   const [isVerifying, setIsVerifying] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState({
//     aadhaar: false,
//     gst: false
//   });

//   const [formData, setFormData] = useState({
//     aadhaarNumber: '',
//     gstNumber: '',
//     vendorName: '',
//     firmName: '',
//     address: '',
//     bankAccountNumber: '',
//     ifscCode: '',
//     bankName: '',
//     contactNumber: '',
//     email: ''
//   });

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleAadhaarVerification = async () => {
//     if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
//       toast({
//         title: "Invalid Aadhaar Number",
//         description: "Please enter a valid 12-digit Aadhaar number.",
//         variant: "destructive"
//       });
//       return;
//     }
//     setIsVerifying(true);
//     setTimeout(() => {
//       setVerificationStatus(prev => ({ ...prev, aadhaar: true }));
//       setFormData(prev => ({
//         ...prev,
//         vendorName: 'OM Nikas',
//         address: '123, MG Road, Mumbai, Maharashtra - 400001'
//       }));
//       setIsVerifying(false);
//       toast({
//         title: "Aadhaar Verified",
//         description: "Identity verification successful.",
//       });
//     }, 2000);
//   };

//   const handleGSTVerification = async () => {
//     if (!formData.gstNumber || formData.gstNumber.length !== 15) {
//       toast({
//         title: "Invalid GST Number",
//         description: "Please enter a valid 15-character GST number.",
//         variant: "destructive"
//       });
//       return;
//     }
//     setIsVerifying(true);
//     setTimeout(() => {
//       setVerificationStatus(prev => ({ ...prev, gst: true }));
//       setFormData(prev => ({
//         ...prev,
//         bankAccountNumber: '1234567890',
//         ifscCode: 'ICIC0001234',
//         bankName: 'ICICI Bank',
//         firmName: 'OM Infra Pvt Ltd'
//       }));
//       setIsVerifying(false);
//       toast({
//         title: "GST Verified",
//         description: "Business verification successful. Firm Name autofilled.",
//       });
//     }, 2000);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Required fields check
//     if (!formData.vendorName || !formData.firmName || !formData.address || !formData.bankAccountNumber || !formData.ifscCode) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive"
//       });
//       return;
//     }

//     const now = new Date();
//     const dateStr = now.toISOString().slice(0, 10);

//     const vendorDTO = {
//       name: formData.vendorName,
//       firmName: formData.firmName,
//       aadhaarNumber: formData.aadhaarNumber,
//       gstNumber: formData.gstNumber,
//       panNumber: "",
//       contactPerson: "",
//       phone: formData.contactNumber,
//       email: formData.email,
//       address: formData.address,
//       city: "",
//       state: "",
//       pincode: "",
//       registrationDate: dateStr,
//       verificationStatus: (verificationStatus.aadhaar && verificationStatus.gst) ? "VERIFIED" : "NOT_VERIFIED",
//       aadhaarVerified: verificationStatus.aadhaar,
//       gstVerified: verificationStatus.gst,
//       type: "",
//       category: "",
//       status: "ACTIVE",
//       performanceRating: 0,
//       creditLimit: 0,
//       paymentTerms: "",
//       bankAccountNumber: formData.bankAccountNumber,
//       bankIfsc: formData.ifscCode,
//       bankName: formData.bankName,
//       bankBranch: "",
//       documentUrls: [],
//       paymentEligible: true,
//       lastUpdated: dateStr,
//       updatedBy: user?.username || "",
//       documentFiles: []
//     };

//     try {
//       const baseURL = import.meta.env.VITE_API_BASE_URL;
//       await axios.post(`${baseURL}/api/vendors/register`, vendorDTO);

//       toast({
//         title: "Vendor Added",
//         description: "Vendor has been successfully registered.",
//       });
//       onSubmit();
//     } catch (err) {
//       toast({
//         title: "Registration Failed",
//         description: "Could not register vendor. Please try again.",
//         variant: "destructive"
//       });
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Shield className="h-6 w-6 text-primary" />
//           Add New Vendor
//         </CardTitle>
//         <CardDescription>
//           Register a new vendor with Aadhaar and GST verification (or enter details manually if not verified).
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Verification Section */}
//           <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               Identity & Business Verification
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="aadhaarNumber"
//                     value={formData.aadhaarNumber}
//                     onChange={(e) => handleInputChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
//                     placeholder="Enter 12-digit Aadhaar number"
//                     maxLength={12}
//                     required
//                   />
//                   <Button
//                     type="button"
//                     onClick={handleAadhaarVerification}
//                     disabled={isVerifying || formData.aadhaarNumber.length !== 12 || verificationStatus.aadhaar}
//                     variant={verificationStatus.aadhaar ? "default" : "outline"}
//                   >
//                     {verificationStatus.aadhaar ? (
//                       <CheckCircle className="h-4 w-4 mr-1" />
//                     ) : null}
//                     {isVerifying ? 'Verifying...' : verificationStatus.aadhaar ? 'Verified' : 'Verify'}
//                   </Button>
//                 </div>
//                 {verificationStatus.aadhaar && (
//                   <Badge className="mt-2 bg-green-100 text-green-800">
//                     <CheckCircle className="h-3 w-3 mr-1" />
//                     Aadhaar Verified
//                   </Badge>
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="gstNumber">GST Number *</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="gstNumber"
//                     value={formData.gstNumber}
//                     onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase().slice(0, 15))}
//                     placeholder="Enter 15-character GST number"
//                     maxLength={15}
//                     required
//                   />
//                   <Button
//                     type="button"
//                     onClick={handleGSTVerification}
//                     disabled={isVerifying || formData.gstNumber.length !== 15 || verificationStatus.gst}
//                     variant={verificationStatus.gst ? "default" : "outline"}
//                   >
//                     {verificationStatus.gst ? (
//                       <CheckCircle className="h-4 w-4 mr-1" />
//                     ) : null}
//                     {isVerifying ? 'Verifying...' : verificationStatus.gst ? 'Verified' : 'Verify'}
//                   </Button>
//                 </div>
//                 {verificationStatus.gst && (
//                   <Badge className="mt-2 bg-green-100 text-green-800">
//                     <CheckCircle className="h-3 w-3 mr-1" />
//                     GST Verified
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Basic Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Basic Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="vendorName">Vendor Name *</Label>
//                 <Input
//                   id="vendorName"
//                   value={formData.vendorName}
//                   onChange={(e) => handleInputChange('vendorName', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="firmName">Firm Name *</Label>
//                 <Input
//                   id="firmName"
//                   value={formData.firmName}
//                   onChange={(e) => handleInputChange('firmName', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="contactNumber">Contact Number</Label>
//                 <Input
//                   id="contactNumber"
//                   value={formData.contactNumber}
//                   onChange={(e) => handleInputChange('contactNumber', e.target.value)}
//                   placeholder=""
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   placeholder="Enter email address"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Bank Details */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Bank Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
//                 <Input
//                   id="bankAccountNumber"
//                   value={formData.bankAccountNumber}
//                   onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="ifscCode">IFSC Code *</Label>
//                 <Input
//                   id="ifscCode"
//                   value={formData.ifscCode}
//                   onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
//                   required
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label htmlFor="bankName">Bank Name *</Label>
//                 <Input
//                   id="bankName"
//                   value={formData.bankName}
//                   onChange={(e) => handleInputChange('bankName', e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex gap-4 pt-4 border-t">
//             <Button 
//               type="submit" 
//               className="bg-[#193A9A] hover:bg-[#142f7c] text-white"
//             >
//               <Save className="h-4 w-4 mr-2" />
//               Submit
//             </Button>
//             <Button type="button" variant="outline" onClick={onCancel}>
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default VendorForm;
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Shield } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface VendorFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ onCancel, onSubmit }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    gstNumber: '',
    panNumber: '',
    vendorName: '',
    firmName: '',
    address: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: '',
    contactNumber: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic required fields validation
    if (!formData.vendorName || !formData.firmName || !formData.bankAccountNumber || !formData.ifscCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    // PAN number validation (optional)
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)) {
      toast({
        title: "Invalid PAN Number",
        description: "Enter a valid 10-character PAN number (e.g., ABCDE1234F).",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);

    const vendorDTO = {
      name: formData.vendorName,
      firmName: formData.firmName,
      aadhaarNumber: formData.aadhaarNumber,
      gstNumber: formData.gstNumber,
      panNumber: formData.panNumber,
      contactPerson: "",
      phone: formData.contactNumber,
      email: formData.email,
      address: formData.address,
      city: "",
      state: "",
      pincode: "",
      registrationDate: dateStr,
      verificationStatus: "NOT_VERIFIED", // No verification for Aadhaar/GST/PAN
      aadhaarVerified: false,
      gstVerified: false,
      type: "",
      category: "",
      status: "ACTIVE",
      performanceRating: 0,
      creditLimit: 0,
      paymentTerms: "",
      bankAccountNumber: formData.bankAccountNumber,
      bankIfsc: formData.ifscCode,
      bankName: formData.bankName,
      bankBranch: "",
      documentUrls: [],
      paymentEligible: true,
      lastUpdated: dateStr,
      updatedBy: user?.username || "",
      documentFiles: []
    };

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(
        `${baseURL}/api/vendors/register`,
        vendorDTO,
        {
          headers: {
            Authorization: `Bearer ${user?.token || ""}`,
            "Content-Type": "application/json"
          }
        }
      );
      toast({
        title: "Vendor Added",
        description: "Vendor has been successfully registered.",
      });
      onSubmit();
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: "Could not register vendor. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Add New Vendor
        </CardTitle>
        <CardDescription>
          Register a new vendor with Aadhaar, GST, and PAN details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Identity & Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aadhaar */}
              <div>
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                />
              </div>
              {/* GST */}
              <div>
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase().slice(0, 15))}
                  placeholder="Enter 15-character GST number"
                  maxLength={15}
                />
              </div>
              {/* PAN */}
              <div>
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) =>
                    handleInputChange(
                      'panNumber',
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
                    )
                  }
                  placeholder="Enter 10-character PAN"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendorName">Vendor Name *</Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="firmName">Firm Name *</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => handleInputChange('firmName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  placeholder=""
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankAccountNumber">Bank Account Number *</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ifscCode">IFSC Code *</Label>
                <Input
                  id="ifscCode"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              type="submit" 
              className="bg-[#193A9A] hover:bg-[#142f7c] text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Submit
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorForm;
