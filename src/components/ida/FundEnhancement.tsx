
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FundEnhancementList from './FundEnhancementList';
import FundEnhancementForm from './FundEnhancementForm';
import FundEnhancementMasterData from './FundEnhancementMasterData';

const FundEnhancement = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const handleNewRequest = () => {
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
          <h1 className="text-3xl font-bold">Fund Enhancement</h1>
          <p className="text-gray-600">Manage fund enhancement requests and approvals</p>
        </div>
        <Button onClick={handleNewRequest}>
          <Plus className="h-4 w-4 mr-2" />
          New Enhancement Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Enhancement List</TabsTrigger>
          <TabsTrigger value="form">Enhancement Form</TabsTrigger>
          <TabsTrigger value="master">Master Data</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <FundEnhancementList />
        </TabsContent>

        <TabsContent value="form">
          <FundEnhancementForm 
            onCancel={handleFormCancel}
            onSubmit={handleFormSubmit}
          />
        </TabsContent>

        <TabsContent value="master">
          <FundEnhancementMasterData />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundEnhancement;
