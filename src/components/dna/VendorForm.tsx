
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vendor } from './VendorVerification';

interface VendorFormProps {
  vendor?: Vendor | null;
  onSubmit: (vendor: Omit<Vendor, 'id'>) => void;
  onCancel: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Vendor, 'id'>>({
    name: '',
    email: '',
    phone: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    category: '',
    type: 'Company',
    registrationDate: new Date().toISOString().split('T')[0],
    verificationStatus: 'Pending',
    documentsSubmitted: [],
    contactPerson: '',
    workExperience: '',
    annualTurnover: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    }
  });

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  useEffect(() => {
    if (vendor) {
      setFormData(vendor);
      setSelectedDocuments(vendor.documentsSubmitted || []);
    }
  }, [vendor]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBankDetailsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails!,
        [field]: value
      }
    }));
  };

  const handleDocumentToggle = (document: string) => {
    setSelectedDocuments(prev => {
      const updated = prev.includes(document)
        ? prev.filter(d => d !== document)
        : [...prev, document];
      
      setFormData(prevForm => ({
        ...prevForm,
        documentsSubmitted: updated
      }));
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const vendorCategories = [
    'IT Services',
    'Construction',
    'Supplies',
    'Consulting',
    'Maintenance',
    'Transport',
    'Catering',
    'Security',
    'Cleaning',
    'Equipment Rental'
  ];

  const documentTypes = [
    'GST Certificate',
    'PAN Card',
    'Aadhaar Card',
    'Bank Statement',
    'MOA (Memorandum of Association)',
    'AOA (Articles of Association)',
    'Partnership Deed',
    'LLP Agreement',
    'Trade License',
    'Professional Tax Certificate',
    'ESI Registration',
    'PF Registration',
    'Cancelled Cheque',
    'Udyog Aadhaar',
    'MSME Certificate'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="contact">Contact & Address</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the vendor's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Vendor Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Vendor Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="LLP">LLP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson || ''}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gstNumber">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    placeholder="27AABCT1234C1Z5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange('panNumber', e.target.value)}
                    placeholder="AABCT1234C"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workExperience">Work Experience</Label>
                  <Input
                    id="workExperience"
                    value={formData.workExperience || ''}
                    onChange={(e) => handleInputChange('workExperience', e.target.value)}
                    placeholder="e.g., 5+ years"
                  />
                </div>
                <div>
                  <Label htmlFor="annualTurnover">Annual Turnover</Label>
                  <Input
                    id="annualTurnover"
                    value={formData.annualTurnover || ''}
                    onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
                    placeholder="e.g., 2 Crore"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Address Information</CardTitle>
              <CardDescription>Enter contact details and address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91-9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents Submitted</CardTitle>
              <CardDescription>Select the documents submitted by the vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map(document => (
                  <div key={document} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={document}
                      checked={selectedDocuments.includes(document)}
                      onChange={() => handleDocumentToggle(document)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <Label htmlFor={document} className="text-sm font-medium">
                      {document}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>Enter vendor's banking information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankDetails?.bankName || ''}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.bankDetails?.accountHolderName || ''}
                    onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.bankDetails?.accountNumber || ''}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={formData.bankDetails?.ifscCode || ''}
                    onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                    placeholder="HDFC0001234"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#193A9A] hover:bg-[#142f7c] text-white">
          {vendor ? 'Update Vendor' : 'Add Vendor'}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;
