
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DepartmentRecord } from './DepartmentManagement';

const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  code: z.string().min(2, 'Department code must be at least 2 characters').max(10, 'Code must be less than 10 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  headName: z.string().min(2, 'Head name must be at least 2 characters'),
  headEmail: z.string().email('Please enter a valid email address'),
  headMobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  district: z.string().min(1, 'Please select a district'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  isActive: z.boolean().default(true),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  department?: DepartmentRecord | null;
  onSubmit: (data: Omit<DepartmentRecord, 'id' | 'createdAt' | 'totalUsers' | 'totalProjects' | 'totalBudget'>) => void;
  onCancel: () => void;
}

const districts = [
  'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 
  'Solapur', 'Amravati', 'Nanded', 'Kolhapur', 'Akola', 'Latur', 'Dhule', 'Ahmednagar',
  'Chandrapur', 'Parbhani', 'Jalgaon', 'Buldhana', 'Ratnagiri', 'Gondia', 'Yavatmal',
  'Nandurbar', 'Wardha', 'Raigad', 'Washim', 'Hingoli', 'Sindhudurg', 'Gadchiroli', 
  'Beed', 'Osmanabad', 'Jalna', 'Sangli', 'Satara'
];

const DepartmentForm: React.FC<DepartmentFormProps> = ({ department, onSubmit, onCancel }) => {
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department?.name || '',
      code: department?.code || '',
      description: department?.description || '',
      headName: department?.headName || '',
      headEmail: department?.headEmail || '',
      headMobile: department?.headMobile || '',
      district: department?.district || '',
      address: department?.address || '',
      isActive: department?.isActive ?? true,
    },
  });

  const handleSubmit = (data: DepartmentFormData) => {
    // Ensure all required fields are present before calling onSubmit
    const departmentData: Omit<DepartmentRecord, 'id' | 'createdAt' | 'totalUsers' | 'totalProjects' | 'totalBudget'> = {
      name: data.name,
      code: data.code,
      description: data.description,
      headName: data.headName,
      headEmail: data.headEmail,
      headMobile: data.headMobile,
      district: data.district,
      address: data.address,
      isActive: data.isActive,
    };
    
    onSubmit(departmentData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter department description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Department Head Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Department Head Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="headName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter head name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Head Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter head email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="headMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Head Mobile Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter 10-digit mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address *</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter complete address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        

        {/* Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={(value) => field.onChange(value === 'active')} value={field.value ? 'active' : 'inactive'}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#193A9A] hover:bg-[#142f7c] text-white">
            {department ? 'Update Department' : 'Create Department'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepartmentForm;
