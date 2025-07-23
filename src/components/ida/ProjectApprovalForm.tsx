
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  projectCode: z.string().min(1, 'Project code is required'),
  department: z.string().min(1, 'Department is required'),
  projectType: z.string().min(1, 'Project type is required'),
  priority: z.string().min(1, 'Priority is required'),
  budget: z.string().min(1, 'Budget is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
  description: z.string().min(1, 'Description is required'),
  objectives: z.string().min(1, 'Objectives are required'),
  beneficiaries: z.string().min(1, 'Beneficiaries information is required'),
  implementationPlan: z.string().min(1, 'Implementation plan is required'),
  riskAssessment: z.string().min(1, 'Risk assessment is required'),
  expectedOutcome: z.string().min(1, 'Expected outcome is required'),
});

interface ProjectApprovalFormProps {
  project?: any;
  onCancel: () => void;
  onSubmit: () => void;
}

const ProjectApprovalForm: React.FC<ProjectApprovalFormProps> = ({ 
  project, 
  onCancel, 
  onSubmit 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: project?.projectName || '',
      projectCode: project?.projectCode || '',
      department: project?.department || '',
      projectType: project?.projectType || '',
      priority: project?.priority || '',
      budget: project?.budget || '',
      startDate: project?.startDate ? new Date(project.startDate) : undefined,
      endDate: project?.endDate ? new Date(project.endDate) : undefined,
      description: project?.description || '',
      objectives: project?.objectives || '',
      beneficiaries: project?.beneficiaries || '',
      implementationPlan: project?.implementationPlan || '',
      riskAssessment: project?.riskAssessment || '',
      expectedOutcome: project?.expectedOutcome || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Project approval form submitted:', values);
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'New Project Approval'}</CardTitle>
        <CardDescription>
          {project ? 'Update project details' : 'Create a new project for approval'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Public Works">Public Works</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Rural Development">Rural Development</SelectItem>
                        <SelectItem value="Urban Development">Urban Development</SelectItem>
                        <SelectItem value="Water Resources">Water Resources</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Welfare">Welfare</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter budget amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Detailed Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed project description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Objectives</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List project objectives" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beneficiaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Beneficiaries</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe target beneficiaries" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="implementationPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Implementation Plan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Outline implementation plan" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riskAssessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Assessment</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Identify potential risks and mitigation strategies" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedOutcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Outcomes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe expected outcomes and impact" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {project ? 'Update Project' : 'Submit for Approval'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectApprovalForm;
