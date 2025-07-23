
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Save, X, Settings } from 'lucide-react';

const FundEnhancementMasterData = () => {
  const [activeTab, setActiveTab] = useState('enhancement-types');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', active: true });

  // Mock data for enhancement types
  const [enhancementTypes, setEnhancementTypes] = useState([
    { id: 1, name: 'Scope Expansion', description: 'Additional work scope beyond original plan', active: true },
    { id: 2, name: 'Cost Escalation', description: 'Price increase due to market conditions', active: true },
    { id: 3, name: 'Additional Features', description: 'New features or improvements', active: true },
    { id: 4, name: 'Quality Improvement', description: 'Upgrades to enhance quality standards', active: true },
    { id: 5, name: 'Contingency', description: 'Emergency or unforeseen requirements', active: true }
  ]);

  // Mock data for urgency levels
  const [urgencyLevels, setUrgencyLevels] = useState([
    { id: 1, name: 'High', description: 'Immediate attention required', color: 'red', active: true },
    { id: 2, name: 'Medium', description: 'Standard priority', color: 'orange', active: true },
    { id: 3, name: 'Low', description: 'Can be processed in regular queue', color: 'gray', active: true }
  ]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
  };

  const handleSave = (item: any) => {
    if (activeTab === 'enhancement-types') {
      setEnhancementTypes(prev => 
        prev.map(type => type.id === item.id ? item : type)
      );
    } else if (activeTab === 'urgency-levels') {
      setUrgencyLevels(prev => 
        prev.map(level => level.id === item.id ? item : level)
      );
    }
    setEditingItem(null);
  };

  const handleAdd = () => {
    if (newItem.name.trim()) {
      const newId = Math.max(...enhancementTypes.map(t => t.id), ...urgencyLevels.map(u => u.id)) + 1;
      const itemToAdd = { ...newItem, id: newId };
      
      if (activeTab === 'enhancement-types') {
        setEnhancementTypes(prev => [...prev, itemToAdd]);
      } else if (activeTab === 'urgency-levels') {
        setUrgencyLevels(prev => [...prev, { ...itemToAdd, color: 'gray' }]);
      }
      
      setNewItem({ name: '', description: '', active: true });
    }
  };

  const handleDelete = (id: number) => {
    if (activeTab === 'enhancement-types') {
      setEnhancementTypes(prev => prev.filter(type => type.id !== id));
    } else if (activeTab === 'urgency-levels') {
      setUrgencyLevels(prev => prev.filter(level => level.id !== id));
    }
  };

  const renderEnhancementTypesTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Enhancement Types
        </CardTitle>
        <CardDescription>Manage different types of fund enhancement categories</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add New Item Form */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-3">Add New Enhancement Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enhancement type name"
              />
            </div>
            <div>
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Type
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enhancementTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    {editingItem?.id === type.id ? (
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <span className="font-medium">{type.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === type.id ? (
                      <Input
                        value={editingItem.description}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                      />
                    ) : (
                      type.description
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={type.active ? 'default' : 'secondary'}>
                      {type.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingItem?.id === type.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(editingItem)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(type)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(type.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderUrgencyLevelsTable = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Urgency Levels
        </CardTitle>
        <CardDescription>Manage urgency level priorities for enhancement requests</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add New Item Form */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-3">Add New Urgency Level</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-urgency-name">Name</Label>
              <Input
                id="new-urgency-name"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Urgency level name"
              />
            </div>
            <div>
              <Label htmlFor="new-urgency-description">Description</Label>
              <Input
                id="new-urgency-description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Level
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urgencyLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell>
                    {editingItem?.id === level.id ? (
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <span className="font-medium">{level.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem?.id === level.id ? (
                      <Input
                        value={editingItem.description}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                      />
                    ) : (
                      level.description
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={`w-4 h-4 rounded-full bg-${level.color}-500`}></div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={level.active ? 'default' : 'secondary'}>
                      {level.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingItem?.id === level.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(editingItem)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(level)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(level.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Master Data Management</h2>
        <p className="text-gray-600">Configure fund enhancement system settings and master data</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="enhancement-types">Enhancement Types</TabsTrigger>
          <TabsTrigger value="urgency-levels">Urgency Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="enhancement-types">
          {renderEnhancementTypesTable()}
        </TabsContent>

        <TabsContent value="urgency-levels">
          {renderUrgencyLevelsTable()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundEnhancementMasterData;
