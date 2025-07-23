
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';
import ProjectProgressList from './ProjectProgressList';
import ProjectProgressForm from './ProjectProgressForm';
import ProjectProgressMasterData from './ProjectProgressMasterData';

const ProjectProgress = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  const handleNewProgress = () => {
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
            <TrendingUp className="h-8 w-8 text-primary" />
            Project Progress
          </h1>
          <p className="text-gray-600">Monitor and update project implementation progress</p>
        </div>
        <Button onClick={handleNewProgress}>
          <Plus className="h-4 w-4 mr-2" />
          Add Progress Update
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Progress List</TabsTrigger>
          <TabsTrigger value="form">Progress Form</TabsTrigger>
          <TabsTrigger value="master">Master Data</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ProjectProgressList />
        </TabsContent>

        <TabsContent value="form">
          <ProjectProgressForm 
            onCancel={handleFormCancel}
            onSubmit={handleFormSubmit}
          />
        </TabsContent>

        <TabsContent value="master">
          <ProjectProgressMasterData />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectProgress;
