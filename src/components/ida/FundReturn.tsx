
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeftRight } from 'lucide-react';
import FundReturnList from './FundReturnList';
import FundReturnForm from './FundReturnForm';
import FundReturnMasterData from './FundReturnMasterData';

const FundReturn = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const handleNewReturn = () => {
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
            <ArrowLeftRight className="h-8 w-8 text-primary" />
            Fund Return
          </h1>
          <p className="text-gray-600">Process fund returns from IDA back to SNA</p>
        </div>
        <Button onClick={handleNewReturn}>
          <Plus className="h-4 w-4 mr-2" />
          New Return Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Return List</TabsTrigger>
          <TabsTrigger value="form">Return Form</TabsTrigger>
          <TabsTrigger value="master">Master Data</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <FundReturnList />
        </TabsContent>

        <TabsContent value="form">
          <FundReturnForm 
            onCancel={handleFormCancel}
            onSubmit={handleFormSubmit}
          />
        </TabsContent>

        <TabsContent value="master">
          <FundReturnMasterData />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundReturn;
