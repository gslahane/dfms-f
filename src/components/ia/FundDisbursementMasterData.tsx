
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, CreditCard, Building2, FileText, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FundDisbursementMasterData = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Bank Transfer', code: 'BT', description: 'Direct bank transfer' },
    { id: 2, name: 'Cheque', code: 'CHQ', description: 'Payment by cheque' },
    { id: 3, name: 'RTGS', code: 'RTGS', description: 'Real Time Gross Settlement' },
    { id: 4, name: 'NEFT', code: 'NEFT', description: 'National Electronic Funds Transfer' },
  ]);

  const [disbursementTypes, setDisbursementTypes] = useState([
    { id: 1, name: 'Advance Payment', code: 'ADV', description: 'Payment made in advance' },
    { id: 2, name: 'Final Payment', code: 'FIN', description: 'Final settlement payment' },
    { id: 3, name: 'Milestone Payment', code: 'MIL', description: 'Payment upon milestone completion' },
    { id: 4, name: 'Emergency Payment', code: 'EMG', description: 'Emergency disbursement' },
  ]);

  const [beneficiaryTypes, setBeneficiaryTypes] = useState([
    { id: 1, name: 'Individual', code: 'IND', description: 'Individual beneficiary' },
    { id: 2, name: 'Organization', code: 'ORG', description: 'Organizational beneficiary' },
    { id: 3, name: 'Contractor', code: 'CON', description: 'Construction contractor' },
    { id: 4, name: 'Supplier', code: 'SUP', description: 'Goods/Services supplier' },
  ]);

  const [documentTypes, setDocumentTypes] = useState([
    { id: 1, name: 'Sanction Order', code: 'SO', description: 'Government sanction order' },
    { id: 2, name: 'Bank Statement', code: 'BS', description: 'Bank account statement' },
    { id: 3, name: 'Invoice', code: 'INV', description: 'Payment invoice' },
    { id: 4, name: 'Work Completion Certificate', code: 'WCC', description: 'Work completion proof' },
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState({ name: '', code: '', description: '' });
  const [newDisbursementType, setNewDisbursementType] = useState({ name: '', code: '', description: '' });
  const [newBeneficiaryType, setNewBeneficiaryType] = useState({ name: '', code: '', description: '' });
  const [newDocumentType, setNewDocumentType] = useState({ name: '', code: '', description: '' });

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.name && newPaymentMethod.code) {
      setPaymentMethods([...paymentMethods, { 
        id: Date.now(), 
        ...newPaymentMethod 
      }]);
      setNewPaymentMethod({ name: '', code: '', description: '' });
    }
  };

  const handleAddDisbursementType = () => {
    if (newDisbursementType.name && newDisbursementType.code) {
      setDisbursementTypes([...disbursementTypes, { 
        id: Date.now(), 
        ...newDisbursementType 
      }]);
      setNewDisbursementType({ name: '', code: '', description: '' });
    }
  };

  const handleAddBeneficiaryType = () => {
    if (newBeneficiaryType.name && newBeneficiaryType.code) {
      setBeneficiaryTypes([...beneficiaryTypes, { 
        id: Date.now(), 
        ...newBeneficiaryType 
      }]);
      setNewBeneficiaryType({ name: '', code: '', description: '' });
    }
  };

  const handleAddDocumentType = () => {
    if (newDocumentType.name && newDocumentType.code) {
      setDocumentTypes([...documentTypes, { 
        id: Date.now(), 
        ...newDocumentType 
      }]);
      setNewDocumentType({ name: '', code: '', description: '' });
    }
  };

  const handleDeletePaymentMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleDeleteDisbursementType = (id: number) => {
    setDisbursementTypes(disbursementTypes.filter(dt => dt.id !== id));
  };

  const handleDeleteBeneficiaryType = (id: number) => {
    setBeneficiaryTypes(beneficiaryTypes.filter(bt => bt.id !== id));
  };

  const handleDeleteDocumentType = (id: number) => {
    setDocumentTypes(documentTypes.filter(dt => dt.id !== id));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="payment-methods" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payment-methods" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="disbursement-types" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Disbursement Types
          </TabsTrigger>
          <TabsTrigger value="beneficiary-types" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Beneficiary Types
          </TabsTrigger>
          <TabsTrigger value="document-types" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Document Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Payment Method</CardTitle>
                <CardDescription>Create a new payment method entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="payment-method-name">Method Name</Label>
                  <Input
                    id="payment-method-name"
                    value={newPaymentMethod.name}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                    placeholder="Enter payment method name"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-method-code">Method Code</Label>
                  <Input
                    id="payment-method-code"
                    value={newPaymentMethod.code}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, code: e.target.value})}
                    placeholder="Enter method code"
                  />
                </div>
                <div>
                  <Label htmlFor="payment-method-description">Description</Label>
                  <Textarea
                    id="payment-method-description"
                    value={newPaymentMethod.description}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddPaymentMethod} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Payment Methods</CardTitle>
                <CardDescription>Manage existing payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-gray-600">Code: {method.code}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disbursement-types">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Disbursement Type */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Fund Proposal Request Type</CardTitle>
                <CardDescription>Create a new Fund Proposal entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="disbursement-type-name">Type Name</Label>
                  <Input
                    id="disbursement-type-name"
                    value={newDisbursementType.name}
                    onChange={(e) => setNewDisbursementType({...newDisbursementType, name: e.target.value})}
                    placeholder="Enter disbursement type name"
                  />
                </div>
                <div>
                  <Label htmlFor="disbursement-type-code">Type Code</Label>
                  <Input
                    id="disbursement-type-code"
                    value={newDisbursementType.code}
                    onChange={(e) => setNewDisbursementType({...newDisbursementType, code: e.target.value})}
                    placeholder="Enter type code"
                  />
                </div>
                <div>
                  <Label htmlFor="disbursement-type-description">Description</Label>
                  <Textarea
                    id="disbursement-type-description"
                    value={newDisbursementType.description}
                    onChange={(e) => setNewDisbursementType({...newDisbursementType, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddDisbursementType} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Disbursement Type
                </Button>
              </CardContent>
            </Card>

            {/* Disbursement Types List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Disbursement Types</CardTitle>
                <CardDescription>Manage existing disbursement types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {disbursementTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-600">Code: {type.code}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDisbursementType(type.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="beneficiary-types">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Beneficiary Type */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Beneficiary Type</CardTitle>
                <CardDescription>Create a new beneficiary type entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="beneficiary-type-name">Type Name</Label>
                  <Input
                    id="beneficiary-type-name"
                    value={newBeneficiaryType.name}
                    onChange={(e) => setNewBeneficiaryType({...newBeneficiaryType, name: e.target.value})}
                    placeholder="Enter beneficiary type name"
                  />
                </div>
                <div>
                  <Label htmlFor="beneficiary-type-code">Type Code</Label>
                  <Input
                    id="beneficiary-type-code"
                    value={newBeneficiaryType.code}
                    onChange={(e) => setNewBeneficiaryType({...newBeneficiaryType, code: e.target.value})}
                    placeholder="Enter type code"
                  />
                </div>
                <div>
                  <Label htmlFor="beneficiary-type-description">Description</Label>
                  <Textarea
                    id="beneficiary-type-description"
                    value={newBeneficiaryType.description}
                    onChange={(e) => setNewBeneficiaryType({...newBeneficiaryType, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddBeneficiaryType} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Beneficiary Type
                </Button>
              </CardContent>
            </Card>

            {/* Beneficiary Types List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Beneficiary Types</CardTitle>
                <CardDescription>Manage existing beneficiary types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {beneficiaryTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-600">Code: {type.code}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteBeneficiaryType(type.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="document-types">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Document Type */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Document Type</CardTitle>
                <CardDescription>Create a new document type entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="document-type-name">Type Name</Label>
                  <Input
                    id="document-type-name"
                    value={newDocumentType.name}
                    onChange={(e) => setNewDocumentType({...newDocumentType, name: e.target.value})}
                    placeholder="Enter document type name"
                  />
                </div>
                <div>
                  <Label htmlFor="document-type-code">Type Code</Label>
                  <Input
                    id="document-type-code"
                    value={newDocumentType.code}
                    onChange={(e) => setNewDocumentType({...newDocumentType, code: e.target.value})}
                    placeholder="Enter type code"
                  />
                </div>
                <div>
                  <Label htmlFor="document-type-description">Description</Label>
                  <Textarea
                    id="document-type-description"
                    value={newDocumentType.description}
                    onChange={(e) => setNewDocumentType({...newDocumentType, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddDocumentType} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document Type
                </Button>
              </CardContent>
            </Card>

            {/* Document Types List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Document Types</CardTitle>
                <CardDescription>Manage existing document types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentTypes.map((type) => (
                    <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-600">Code: {type.code}</p>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDocumentType(type.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundDisbursementMasterData;
