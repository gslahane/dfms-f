
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, CheckCircle } from 'lucide-react';
import VendorList from './VendorList';
import VendorForm from './VendorForm';
import VendorMasterData from './VendorMasterData';
import VendorVerification from './VendorVerification';

const VendorManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const handleNewVendor = () => {
    setShowForm(true);
    setActiveTab('form');
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setActiveTab('list');
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Vendor Management
          </h1>
          <p className="text-gray-600">Manage vendor information, verification, and relationships</p>
        </div>
        <Button onClick={handleNewVendor}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Vendor
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Vendor List</TabsTrigger>
          <TabsTrigger value="form">Add Vendor</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <VendorList />
        </TabsContent>

        <TabsContent value="form">
          <VendorForm 
            onCancel={handleFormCancel}
            onSubmit={handleFormSubmit}
          />
        </TabsContent>

        <TabsContent value="verification">
          <VendorVerification />
        </TabsContent>

        <TabsContent value="master">
          <VendorMasterData />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorManagement;
