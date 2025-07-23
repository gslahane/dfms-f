
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { IndianRupee } from 'lucide-react';

interface FormData {
  district: string;
  amount: string;
  allocationDate: string;
  remarks: string;
}

interface FundAllocationFormProps {
  formData: FormData;
  isSubmitting: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  formatCurrency: (amount: string) => string;
}

const districts = [
  'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik',
  'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Raigad',
  'Ratnagiri', 'Sindhudurg', 'Osmanabad', 'Ahmednagar', 'Beed', 'Latur',
  'Parbhani', 'Hingoli', 'Jalna', 'Buldhana', 'Akola', 'Washim',
  'Amravati', 'Wardha', 'Yavatmal', 'Nandurbar', 'Dhule', 'Jalgaon',
  'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli'
];

const FundAllocationForm: React.FC<FundAllocationFormProps> = ({
  formData,
  isSubmitting,
  onInputChange,
  onSubmit,
  formatCurrency
}) => {
  return (
    <div className="p-4">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district">Select District *</Label>
            <Select 
              value={formData.district} 
              onValueChange={(value) => onInputChange('district', value)}
              required
            >
              <SelectTrigger className="border-gray-300 focus:border-[#193A9A]">
                <SelectValue placeholder="Choose district" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocationDate">Allocation Date *</Label>
            <Input
              id="allocationDate"
              type="date"
              value={formData.allocationDate}
              onChange={(e) => onInputChange('allocationDate', e.target.value)}
              className="border-gray-300 focus:border-[#193A9A]"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Allocation Amount (₹) *</Label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d.]/g, '');
                onInputChange('amount', value);
              }}
              className="border-gray-300 focus:border-[#193A9A] pl-8"
              placeholder="Enter amount in rupees"
              required
            />
            <IndianRupee className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          </div>
          {formData.amount && (
            <p className="text-sm text-gray-600">
              Amount: ₹{formatCurrency(formData.amount)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => onInputChange('remarks', e.target.value)}
            className="border-gray-300 focus:border-[#193A9A]"
            placeholder="Add any additional notes or conditions"
            rows={3}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Alert className="bg-blue-50 text-blue-800 border-blue-200 flex-1 mr-4">
            <AlertDescription className="text-sm">
              Allocation will be subject to approval and audit requirements.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.district || !formData.amount}
            className="bg-[#193A9A] hover:bg-[#142f7c] text-white min-w-32"
          >
            {isSubmitting ? 'Allocating...' : 'Allocate Funds'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FundAllocationForm;
