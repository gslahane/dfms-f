
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar, IndianRupee, FileText, Save, X } from 'lucide-react';

interface FundEnhancementFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const FundEnhancementForm: React.FC<FundEnhancementFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    currentBudget: '',
    enhancementAmount: '',
    totalBudget: '',
    justification: '',
    urgency: '',
    enhancementType: '',
    expectedOutcome: '',
    timeline: '',
    department: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate total budget
      if (field === 'currentBudget' || field === 'enhancementAmount') {
        const current = parseFloat(newData.currentBudget) || 0;
        const enhancement = parseFloat(newData.enhancementAmount) || 0;
        newData.totalBudget = (current + enhancement).toString();
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Fund Enhancement Request Submitted:', formData);
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" />
          Fund Enhancement Request
        </CardTitle>
        <CardDescription>Submit a request for additional project funding</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Project Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rural-development">Rural Development</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="health">Health & Welfare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Financial Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentBudget">Current Budget (₹)</Label>
                <Input
                  id="currentBudget"
                  type="number"
                  value={formData.currentBudget}
                  onChange={(e) => handleInputChange('currentBudget', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enhancementAmount">Enhancement Amount (₹)</Label>
                <Input
                  id="enhancementAmount"
                  type="number"
                  value={formData.enhancementAmount}
                  onChange={(e) => handleInputChange('enhancementAmount', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalBudget">Total Budget (₹)</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={formData.totalBudget}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enhancementType">Enhancement Type</Label>
                <Select onValueChange={(value) => handleInputChange('enhancementType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select enhancement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scope-expansion">Scope Expansion</SelectItem>
                    <SelectItem value="cost-escalation">Cost Escalation</SelectItem>
                    <SelectItem value="additional-features">Additional Features</SelectItem>
                    <SelectItem value="quality-improvement">Quality Improvement</SelectItem>
                    <SelectItem value="contingency">Contingency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Additional Information
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => handleInputChange('justification', e.target.value)}
                  placeholder="Provide detailed justification for fund enhancement"
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedOutcome">Expected Outcome</Label>
                <Textarea
                  id="expectedOutcome"
                  value={formData.expectedOutcome}
                  onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
                  placeholder="Describe expected outcomes with enhanced funding"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Implementation Timeline</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="e.g., 6 months from approval"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Submit Enhancement Request
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FundEnhancementForm;
