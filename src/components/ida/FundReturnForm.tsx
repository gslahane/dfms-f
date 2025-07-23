
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Save, X, Upload, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FundReturnFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const FundReturnForm: React.FC<FundReturnFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    returnAmount: '',
    returnReason: '',
    remainingAmount: '',
    utilizationPercentage: '',
    bankDetails: '',
    utrNumber: '',
    returnType: '',
    department: '',
    justification: '',
    attachments: [] as string[]
  });
  const [returnDate, setReturnDate] = useState<Date>();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      setFormData(prev => ({ 
        ...prev, 
        attachments: [...prev.attachments, ...fileNames] 
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Fund Return Request Submitted:', formData);
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          Fund Return Request
        </CardTitle>
        <CardDescription>Submit a request to return unused funds to SNA</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Information</h3>
            
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
            <h3 className="text-lg font-semibold">Financial Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="returnAmount">Return Amount (₹)</Label>
                <Input
                  id="returnAmount"
                  type="number"
                  value={formData.returnAmount}
                  onChange={(e) => handleInputChange('returnAmount', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remainingAmount">Remaining Amount (₹)</Label>
                <Input
                  id="remainingAmount"
                  type="number"
                  value={formData.remainingAmount}
                  onChange={(e) => handleInputChange('remainingAmount', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="utilizationPercentage">Utilization %</Label>
                <Input
                  id="utilizationPercentage"
                  type="number"
                  value={formData.utilizationPercentage}
                  onChange={(e) => handleInputChange('utilizationPercentage', e.target.value)}
                  placeholder="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="returnType">Return Type</Label>
                <Select onValueChange={(value) => handleInputChange('returnType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project-completion">Project Completion</SelectItem>
                    <SelectItem value="excess-funds">Excess Funds</SelectItem>
                    <SelectItem value="project-cancellation">Project Cancellation</SelectItem>
                    <SelectItem value="scope-reduction">Scope Reduction</SelectItem>
                    <SelectItem value="cost-saving">Cost Saving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="returnReason">Return Reason</Label>
                <Select onValueChange={(value) => handleInputChange('returnReason', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unused-allocation">Unused Allocation</SelectItem>
                    <SelectItem value="project-completed">Project Completed</SelectItem>
                    <SelectItem value="scope-change">Scope Change</SelectItem>
                    <SelectItem value="technical-issues">Technical Issues</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Return Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Return Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !returnDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : "Select return date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="utrNumber">UTR Number</Label>
                <Input
                  id="utrNumber"
                  value={formData.utrNumber}
                  onChange={(e) => handleInputChange('utrNumber', e.target.value)}
                  placeholder="Enter UTR number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankDetails">Bank Details</Label>
              <Textarea
                id="bankDetails"
                value={formData.bankDetails}
                onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                placeholder="Enter bank account details"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                placeholder="Provide detailed justification for fund return"
                rows={4}
                required
              />
            </div>
          </div>

          <Separator />

          {/* File Attachments */}
          <div className="space-y-4">
            <Label>Supporting Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Upload supporting documents
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="mt-2">
                  Choose Files
                </Button>
              </Label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files:</Label>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Submit Return Request
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

export default FundReturnForm;
