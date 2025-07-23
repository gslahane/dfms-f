
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar, Save, X, Plus, Trash2 } from 'lucide-react';

interface ProjectProgressFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const ProjectProgressForm: React.FC<ProjectProgressFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    department: '',
    location: '',
    projectManager: '',
    startDate: '',
    expectedCompletion: '',
    overallProgress: '',
    physicalProgress: '',
    financialProgress: '',
    status: '',
    allocatedBudget: '',
    utilizedBudget: '',
    issues: [''],
    nextActions: [''],
    updateNotes: ''
  });

  const [milestones, setMilestones] = useState([
    { name: '', targetDate: '', actualDate: '', status: 'Pending' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'issues' | 'nextActions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'issues' | 'nextActions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'issues' | 'nextActions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ));
  };

  const addMilestone = () => {
    setMilestones(prev => [...prev, { name: '', targetDate: '', actualDate: '', status: 'Pending' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Project Progress Data:', { ...formData, milestones });
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Basic project details and identification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div>
              <Label htmlFor="projectCode">Project Code *</Label>
              <Input
                id="projectCode"
                value={formData.projectCode}
                onChange={(e) => handleInputChange('projectCode', e.target.value)}
                placeholder="Enter project code"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Rural Development">Rural Development</SelectItem>
                  <SelectItem value="Public Works">Public Works</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter project location"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="projectManager">Project Manager *</Label>
            <Input
              id="projectManager"
              value={formData.projectManager}
              onChange={(e) => handleInputChange('projectManager', e.target.value)}
              placeholder="Enter project manager name"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Project start and completion dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="expectedCompletion">Expected Completion *</Label>
              <Input
                id="expectedCompletion"
                type="date"
                value={formData.expectedCompletion}
                onChange={(e) => handleInputChange('expectedCompletion', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Information */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Information</CardTitle>
          <CardDescription>Current progress status and percentages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="overallProgress">Overall Progress (%) *</Label>
              <Input
                id="overallProgress"
                type="number"
                min="0"
                max="100"
                value={formData.overallProgress}
                onChange={(e) => handleInputChange('overallProgress', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="physicalProgress">Physical Progress (%) *</Label>
              <Input
                id="physicalProgress"
                type="number"
                min="0"
                max="100"
                value={formData.physicalProgress}
                onChange={(e) => handleInputChange('physicalProgress', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="financialProgress">Financial Progress (%) *</Label>
              <Input
                id="financialProgress"
                type="number"
                min="0"
                max="100"
                value={formData.financialProgress}
                onChange={(e) => handleInputChange('financialProgress', e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Project Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="On Track">On Track</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Budget Information */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Information</CardTitle>
          <CardDescription>Financial details and utilization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="allocatedBudget">Allocated Budget (₹) *</Label>
              <Input
                id="allocatedBudget"
                type="number"
                value={formData.allocatedBudget}
                onChange={(e) => handleInputChange('allocatedBudget', e.target.value)}
                placeholder="Enter allocated budget"
                required
              />
            </div>
            <div>
              <Label htmlFor="utilizedBudget">Utilized Budget (₹) *</Label>
              <Input
                id="utilizedBudget"
                type="number"
                value={formData.utilizedBudget}
                onChange={(e) => handleInputChange('utilizedBudget', e.target.value)}
                placeholder="Enter utilized budget"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
          <CardDescription>Key project milestones and their status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Milestone {index + 1}</h4>
                {milestones.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMilestone(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Milestone Name</Label>
                  <Input
                    value={milestone.name}
                    onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                    placeholder="Enter milestone name"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={milestone.status}
                    onValueChange={(value) => handleMilestoneChange(index, 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={milestone.targetDate}
                    onChange={(e) => handleMilestoneChange(index, 'targetDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Actual Date</Label>
                  <Input
                    type="date"
                    value={milestone.actualDate}
                    onChange={(e) => handleMilestoneChange(index, 'actualDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addMilestone}>
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </CardContent>
      </Card>

      {/* Issues and Next Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Issues</CardTitle>
            <CardDescription>List any current project issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.issues.map((issue, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={issue}
                  onChange={(e) => handleArrayChange('issues', index, e.target.value)}
                  placeholder="Describe the issue"
                />
                {formData.issues.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('issues', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addArrayItem('issues')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Issue
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Actions</CardTitle>
            <CardDescription>List upcoming actions and tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.nextActions.map((action, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={action}
                  onChange={(e) => handleArrayChange('nextActions', index, e.target.value)}
                  placeholder="Describe the next action"
                />
                {formData.nextActions.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('nextActions', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addArrayItem('nextActions')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Update Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Update Notes</CardTitle>
          <CardDescription>Additional notes or comments about this update</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.updateNotes}
            onChange={(e) => handleInputChange('updateNotes', e.target.value)}
            placeholder="Enter any additional notes or comments..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Progress Update
        </Button>
      </div>
    </form>
  );
};

export default ProjectProgressForm;
