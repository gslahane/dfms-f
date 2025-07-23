
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

const ProjectApprovalMasterData = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Public Works', code: 'PWD', description: 'Public Works Department' },
    { id: 2, name: 'Education', code: 'EDU', description: 'Education Department' },
    { id: 3, name: 'Health', code: 'HLT', description: 'Health Department' },
    { id: 4, name: 'Rural Development', code: 'RD', description: 'Rural Development Department' },
    { id: 5, name: 'Urban Development', code: 'UD', description: 'Urban Development Department' },
    { id: 6, name: 'Water Resources', code: 'WR', description: 'Water Resources Department' },
  ]);

  const [projectTypes, setProjectTypes] = useState([
    { id: 1, name: 'Infrastructure', code: 'INFRA', description: 'Infrastructure development projects' },
    { id: 2, name: 'Development', code: 'DEV', description: 'General development projects' },
    { id: 3, name: 'Welfare', code: 'WEL', description: 'Social welfare projects' },
    { id: 4, name: 'Technology', code: 'TECH', description: 'Technology implementation projects' },
    { id: 5, name: 'Environment', code: 'ENV', description: 'Environmental projects' },
  ]);

  const [approvalStages, setApprovalStages] = useState([
    { id: 1, name: 'Initial Review', code: 'IR', description: 'Initial project review stage', order: 1 },
    { id: 2, name: 'Technical Review', code: 'TR', description: 'Technical evaluation stage', order: 2 },
    { id: 3, name: 'Financial Review', code: 'FR', description: 'Financial assessment stage', order: 3 },
    { id: 4, name: 'Committee Review', code: 'CR', description: 'Committee evaluation stage', order: 4 },
    { id: 5, name: 'Final Approval', code: 'FA', description: 'Final approval stage', order: 5 },
  ]);

  const [budgetCategories, setBudgetCategories] = useState([
    { id: 1, name: 'Small Scale', code: 'SS', minAmount: 0, maxAmount: 10000000, description: 'Projects up to ₹1 Crore' },
    { id: 2, name: 'Medium Scale', code: 'MS', minAmount: 10000001, maxAmount: 50000000, description: 'Projects ₹1-5 Crores' },
    { id: 3, name: 'Large Scale', code: 'LS', minAmount: 50000001, maxAmount: 200000000, description: 'Projects ₹5-20 Crores' },
    { id: 4, name: 'Mega Projects', code: 'MP', minAmount: 200000001, maxAmount: null, description: 'Projects above ₹20 Crores' },
  ]);

  const [newItem, setNewItem] = useState<any>({});
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('departments');

  const handleAddItem = (type: string) => {
    const newId = Math.max(...getCurrentData(type).map((item: any) => item.id)) + 1;
    const itemWithId = { ...newItem, id: newId };
    updateData(type, [...getCurrentData(type), itemWithId]);
    setNewItem({});
  };

  const handleEditItem = (type: string, updatedItem: any) => {
    const updatedData = getCurrentData(type).map((item: any) => 
      item.id === updatedItem.id ? updatedItem : item
    );
    updateData(type, updatedData);
    setEditingItem(null);
  };

  const handleDeleteItem = (type: string, id: number) => {
    const filteredData = getCurrentData(type).filter((item: any) => item.id !== id);
    updateData(type, filteredData);
  };

  const getCurrentData = (type: string) => {
    switch (type) {
      case 'departments': return departments;
      case 'projectTypes': return projectTypes;
      case 'approvalStages': return approvalStages;
      case 'budgetCategories': return budgetCategories;
      default: return [];
    }
  };

  const updateData = (type: string, data: any[]) => {
    switch (type) {
      case 'departments': setDepartments(data); break;
      case 'projectTypes': setProjectTypes(data); break;
      case 'approvalStages': setApprovalStages(data); break;
      case 'budgetCategories': setBudgetCategories(data); break;
    }
  };

  const renderTable = (type: string, data: any[]) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setNewItem({})}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New {type.slice(0, -1)}</DialogTitle>
              <DialogDescription>
                Enter the details for the new {type.slice(0, -1)}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input
                  id="code"
                  value={newItem.code || ''}
                  onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              {type === 'approvalStages' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order" className="text-right">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newItem.order || ''}
                    onChange={(e) => setNewItem({...newItem, order: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
              )}
              {type === 'budgetCategories' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minAmount" className="text-right">Min Amount</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      value={newItem.minAmount || ''}
                      onChange={(e) => setNewItem({...newItem, minAmount: parseInt(e.target.value)})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxAmount" className="text-right">Max Amount</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      value={newItem.maxAmount || ''}
                      onChange={(e) => setNewItem({...newItem, maxAmount: parseInt(e.target.value) || null})}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => handleAddItem(type)}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              {type === 'approvalStages' && <TableHead>Order</TableHead>}
              {type === 'budgetCategories' && (
                <>
                  <TableHead>Min Amount</TableHead>
                  <TableHead>Max Amount</TableHead>
                </>
              )}
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.description}</TableCell>
                {type === 'approvalStages' && <TableCell>{item.order}</TableCell>}
                {type === 'budgetCategories' && (
                  <>
                    <TableCell>₹{item.minAmount?.toLocaleString()}</TableCell>
                    <TableCell>{item.maxAmount ? `₹${item.maxAmount.toLocaleString()}` : 'No Limit'}</TableCell>
                  </>
                )}
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteItem(type, item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Approval Master Data</CardTitle>
        <CardDescription>Manage master data for project approval system</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="projectTypes">Project Types</TabsTrigger>
            <TabsTrigger value="approvalStages">Approval Stages</TabsTrigger>
            <TabsTrigger value="budgetCategories">Budget Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="departments">
            {renderTable('departments', departments)}
          </TabsContent>
          
          <TabsContent value="projectTypes">
            {renderTable('projectTypes', projectTypes)}
          </TabsContent>
          
          <TabsContent value="approvalStages">
            {renderTable('approvalStages', approvalStages)}
          </TabsContent>
          
          <TabsContent value="budgetCategories">
            {renderTable('budgetCategories', budgetCategories)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectApprovalMasterData;
