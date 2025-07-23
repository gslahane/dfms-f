
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Edit, Trash2, Database } from 'lucide-react';

const FundReturnMasterData = () => {
  const [returnTypes, setReturnTypes] = useState([
    { id: '1', name: 'Project Completion', code: 'PC', description: 'Return after project completion', status: 'Active' },
    { id: '2', name: 'Excess Funds', code: 'EF', description: 'Return of excess allocated funds', status: 'Active' },
    { id: '3', name: 'Project Cancellation', code: 'PX', description: 'Return due to project cancellation', status: 'Active' },
    { id: '4', name: 'Scope Reduction', code: 'SR', description: 'Return due to scope reduction', status: 'Active' },
    { id: '5', name: 'Cost Saving', code: 'CS', description: 'Return due to cost optimization', status: 'Active' }
  ]);

  const [returnReasons, setReturnReasons] = useState([
    { id: '1', name: 'Unused Allocation', code: 'UA', description: 'Funds not utilized as planned', status: 'Active' },
    { id: '2', name: 'Project Completed', code: 'PC', description: 'Project completed successfully', status: 'Active' },
    { id: '3', name: 'Scope Change', code: 'SC', description: 'Change in project scope', status: 'Active' },
    { id: '4', name: 'Technical Issues', code: 'TI', description: 'Technical problems preventing completion', status: 'Active' },
    { id: '5', name: 'Other', code: 'OT', description: 'Other miscellaneous reasons', status: 'Active' }
  ]);

  const [departments, setDepartments] = useState([
    { id: '1', name: 'Rural Development', code: 'RD', description: 'Rural development projects', status: 'Active' },
    { id: '2', name: 'Infrastructure', code: 'IF', description: 'Infrastructure development', status: 'Active' },
    { id: '3', name: 'Health & Welfare', code: 'HW', description: 'Health and welfare programs', status: 'Active' },
    { id: '4', name: 'Education', code: 'ED', description: 'Educational initiatives', status: 'Active' },
    { id: '5', name: 'Agriculture', code: 'AG', description: 'Agricultural development', status: 'Active' },
    { id: '6', name: 'Transport', code: 'TP', description: 'Transportation projects', status: 'Active' }
  ]);

  const [newItem, setNewItem] = useState({ name: '', code: '', description: '' });
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleAddItem = (type: string) => {
    if (!newItem.name || !newItem.code) return;

    const item = {
      id: Date.now().toString(),
      ...newItem,
      status: 'Active'
    };

    switch (type) {
      case 'types':
        setReturnTypes(prev => [...prev, item]);
        break;
      case 'reasons':
        setReturnReasons(prev => [...prev, item]);
        break;
      case 'departments':
        setDepartments(prev => [...prev, item]);
        break;
    }

    setNewItem({ name: '', code: '', description: '' });
  };

  const handleDeleteItem = (id: string, type: string) => {
    switch (type) {
      case 'types':
        setReturnTypes(prev => prev.filter(item => item.id !== id));
        break;
      case 'reasons':
        setReturnReasons(prev => prev.filter(item => item.id !== id));
        break;
      case 'departments':
        setDepartments(prev => prev.filter(item => item.id !== id));
        break;
    }
  };

  const MasterDataTable = ({ data, type, title }: { data: any[], type: string, title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Manage {title.toLowerCase()} for fund return requests</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add New Item Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-2">
            <Label htmlFor={`${type}-name`}>Name</Label>
            <Input
              id={`${type}-name`}
              placeholder="Enter name"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}-code`}>Code</Label>
            <Input
              id={`${type}-code`}
              placeholder="Enter code"
              value={newItem.code}
              onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}-description`}>Description</Label>
            <Input
              id={`${type}-description`}
              placeholder="Enter description"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={() => handleAddItem(type)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.code}</Badge>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Badge className={item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id, type)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Master Data Management</h2>
          <p className="text-gray-600">Configure master data for fund return system</p>
        </div>
      </div>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="types">Return Types</TabsTrigger>
          <TabsTrigger value="reasons">Return Reasons</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="types">
          <MasterDataTable data={returnTypes} type="types" title="Return Types" />
        </TabsContent>

        <TabsContent value="reasons">
          <MasterDataTable data={returnReasons} type="reasons" title="Return Reasons" />
        </TabsContent>

        <TabsContent value="departments">
          <MasterDataTable data={departments} type="departments" title="Departments" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundReturnMasterData;
