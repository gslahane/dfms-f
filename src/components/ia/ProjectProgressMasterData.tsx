
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Settings, Target, AlertCircle } from 'lucide-react';

const ProjectProgressMasterData = () => {
  const [newStatus, setNewStatus] = useState({ name: '', color: '', description: '' });
  const [newMilestoneType, setNewMilestoneType] = useState({ name: '', description: '', defaultDuration: '' });
  const [newIssueCategory, setNewIssueCategory] = useState({ name: '', description: '', severity: '' });

  // Mock data for project statuses
  const [projectStatuses, setProjectStatuses] = useState([
    { id: 1, name: 'On Track', color: 'bg-blue-100 text-blue-800', description: 'Project is progressing as planned', active: true },
    { id: 2, name: 'Delayed', color: 'bg-red-100 text-red-800', description: 'Project is behind schedule', active: true },
    { id: 3, name: 'At Risk', color: 'bg-yellow-100 text-yellow-800', description: 'Project has potential issues', active: true },
    { id: 4, name: 'Completed', color: 'bg-green-100 text-green-800', description: 'Project has been completed', active: true },
    { id: 5, name: 'On Hold', color: 'bg-gray-100 text-gray-800', description: 'Project has been temporarily suspended', active: true }
  ]);

  // Mock data for milestone types
  const [milestoneTypes, setMilestoneTypes] = useState([
    { id: 1, name: 'Planning Phase', description: 'Initial project planning and design', defaultDuration: '30', active: true },
    { id: 2, name: 'Implementation Phase', description: 'Main project implementation', defaultDuration: '90', active: true },
    { id: 3, name: 'Testing Phase', description: 'Testing and quality assurance', defaultDuration: '15', active: true },
    { id: 4, name: 'Deployment Phase', description: 'Final deployment and handover', defaultDuration: '7', active: true }
  ]);

  // Mock data for issue categories
  const [issueCategories, setIssueCategories] = useState([
    { id: 1, name: 'Technical Issues', description: 'Technology-related problems', severity: 'High', active: true },
    { id: 2, name: 'Resource Constraints', description: 'Shortage of resources', severity: 'Medium', active: true },
    { id: 3, name: 'Budget Overrun', description: 'Budget exceeded planned amount', severity: 'High', active: true },
    { id: 4, name: 'Timeline Delays', description: 'Schedule delays', severity: 'Medium', active: true },
    { id: 5, name: 'Vendor Issues', description: 'Problems with vendors or suppliers', severity: 'Medium', active: true }
  ]);

  const handleAddStatus = () => {
    if (newStatus.name) {
      const newId = Math.max(...projectStatuses.map(s => s.id)) + 1;
      setProjectStatuses([...projectStatuses, {
        id: newId,
        name: newStatus.name,
        color: newStatus.color || 'bg-gray-100 text-gray-800',
        description: newStatus.description,
        active: true
      }]);
      setNewStatus({ name: '', color: '', description: '' });
    }
  };

  const handleAddMilestoneType = () => {
    if (newMilestoneType.name) {
      const newId = Math.max(...milestoneTypes.map(m => m.id)) + 1;
      setMilestoneTypes([...milestoneTypes, {
        id: newId,
        name: newMilestoneType.name,
        description: newMilestoneType.description,
        defaultDuration: newMilestoneType.defaultDuration,
        active: true
      }]);
      setNewMilestoneType({ name: '', description: '', defaultDuration: '' });
    }
  };

  const handleAddIssueCategory = () => {
    if (newIssueCategory.name) {
      const newId = Math.max(...issueCategories.map(i => i.id)) + 1;
      setIssueCategories([...issueCategories, {
        id: newId,
        name: newIssueCategory.name,
        description: newIssueCategory.description,
        severity: newIssueCategory.severity,
        active: true
      }]);
      setNewIssueCategory({ name: '', description: '', severity: '' });
    }
  };

  const toggleActive = (type: 'status' | 'milestone' | 'issue', id: number) => {
    if (type === 'status') {
      setProjectStatuses(prev => prev.map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      ));
    } else if (type === 'milestone') {
      setMilestoneTypes(prev => prev.map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      ));
    } else {
      setIssueCategories(prev => prev.map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      ));
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Project Progress Master Data
          </CardTitle>
          <CardDescription>
            Manage master data for project progress tracking
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="statuses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statuses">Project Statuses</TabsTrigger>
          <TabsTrigger value="milestones">Milestone Types</TabsTrigger>
          <TabsTrigger value="issues">Issue Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="statuses">
          <Card>
            <CardHeader>
              <CardTitle>Project Statuses</CardTitle>
              <CardDescription>Manage available project status options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="statusName">Status Name</Label>
                  <Input
                    id="statusName"
                    value={newStatus.name}
                    onChange={(e) => setNewStatus({...newStatus, name: e.target.value})}
                    placeholder="Enter status name"
                  />
                </div>
                <div>
                  <Label htmlFor="statusColor">Color Class</Label>
                  <Input
                    id="statusColor"
                    value={newStatus.color}
                    onChange={(e) => setNewStatus({...newStatus, color: e.target.value})}
                    placeholder="e.g., bg-blue-100 text-blue-800"
                  />
                </div>
                <div>
                  <Label htmlFor="statusDescription">Description</Label>
                  <Input
                    id="statusDescription"
                    value={newStatus.description}
                    onChange={(e) => setNewStatus({...newStatus, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button onClick={handleAddStatus}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Status
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status Name</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectStatuses.map((status) => (
                      <TableRow key={status.id}>
                        <TableCell className="font-medium">{status.name}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.name}</Badge>
                        </TableCell>
                        <TableCell>{status.description}</TableCell>
                        <TableCell>
                          <Badge variant={status.active ? "default" : "secondary"}>
                            {status.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleActive('status', status.id)}
                            >
                              {status.active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Milestone Types
              </CardTitle>
              <CardDescription>Manage milestone types and their default durations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="milestoneName">Milestone Type</Label>
                  <Input
                    id="milestoneName"
                    value={newMilestoneType.name}
                    onChange={(e) => setNewMilestoneType({...newMilestoneType, name: e.target.value})}
                    placeholder="Enter milestone type"
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneDescription">Description</Label>
                  <Input
                    id="milestoneDescription"
                    value={newMilestoneType.description}
                    onChange={(e) => setNewMilestoneType({...newMilestoneType, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <Label htmlFor="defaultDuration">Default Duration (days)</Label>
                  <Input
                    id="defaultDuration"
                    type="number"
                    value={newMilestoneType.defaultDuration}
                    onChange={(e) => setNewMilestoneType({...newMilestoneType, defaultDuration: e.target.value})}
                    placeholder="Enter days"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button onClick={handleAddMilestoneType}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone Type
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Default Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {milestoneTypes.map((milestone) => (
                      <TableRow key={milestone.id}>
                        <TableCell className="font-medium">{milestone.name}</TableCell>
                        <TableCell>{milestone.description}</TableCell>
                        <TableCell>{milestone.defaultDuration} days</TableCell>
                        <TableCell>
                          <Badge variant={milestone.active ? "default" : "secondary"}>
                            {milestone.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleActive('milestone', milestone.id)}
                            >
                              {milestone.active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Issue Categories
              </CardTitle>
              <CardDescription>Manage issue categories and their severity levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <Label htmlFor="issueName">Category Name</Label>
                  <Input
                    id="issueName"
                    value={newIssueCategory.name}
                    onChange={(e) => setNewIssueCategory({...newIssueCategory, name: e.target.value})}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="issueDescription">Description</Label>
                  <Input
                    id="issueDescription"
                    value={newIssueCategory.description}
                    onChange={(e) => setNewIssueCategory({...newIssueCategory, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <Label htmlFor="issueSeverity">Severity Level</Label>
                  <select
                    id="issueSeverity"
                    value={newIssueCategory.severity}
                    onChange={(e) => setNewIssueCategory({...newIssueCategory, severity: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button onClick={handleAddIssueCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Issue Category
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issueCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(category.severity)}>
                            {category.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.active ? "default" : "secondary"}>
                            {category.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleActive('issue', category.id)}
                            >
                              {category.active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectProgressMasterData;
