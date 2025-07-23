import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/contexts/AuthContext';
import { UserRecord } from './FundDemand';

interface UserFormProps {
  user?: UserRecord | null;
  onSubmit: (userData: Omit<UserRecord, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'IA' as UserRole,
    department: 'Maharashtra Government',
    district: '',
    isActive: true,
    isFirstLogin: true,
    lastLogin: undefined as string | undefined,
    // ── Bank Details ────────────────────────────────────────
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        department: user.department || 'Maharashtra Government',
        district: user.district || '',
        isActive: user.isActive,
        isFirstLogin: user.isFirstLogin,
        lastLogin: user.lastLogin,
        // ── preload bank details if present ───────────────────
        bankName: (user as any).bankName || '',
        accountHolderName: (user as any).accountHolderName || '',
        accountNumber: (user as any).accountNumber || '',
        ifscCode: (user as any).ifscCode || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Pass everything including bank details
    onSubmit(formData as Omit<UserRecord, 'id' | 'createdAt'>);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const districts = [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik',
    'Aurangabad', 'Solapur', 'Kolhapur', 'Ahmednagar', 'Satara', 'Sangli'
  ];

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'SNA', label: 'State Nodal Agency', description: 'Highest administrative authority' },
    { value: 'DNA', label: 'District Nodal Agency', description: 'District level administration' },
    { value: 'IDA', label: 'Implementation District Agency', description: 'Project implementation' },
    { value: 'IA', label: 'Implementation Agency', description: 'Ground level implementation' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Personal & Role Info ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>
        {/* Mobile */}
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            type="tel"
            value={formData.mobile}
            onChange={e => handleInputChange('mobile', e.target.value)}
            placeholder="Enter mobile number"
            maxLength={10}
            required
          />
        </div>
        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">User Role *</Label>
          <Select
            value={formData.role}
            onValueChange={value => handleInputChange('role', value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map(r => (
                <SelectItem key={r.value} value={r.value}>
                  <div>
                    <div className="font-medium">{r.label}</div>
                    <div className="text-sm text-gray-500">{r.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            type="text"
            value={formData.department}
            onChange={e => handleInputChange('department', e.target.value)}
            placeholder="Enter department"
          />
        </div>
        {/* District */}
        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <Select
            value={formData.district}
            onValueChange={value => handleInputChange('district', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map(d => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Bank Details Section ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              type="text"
              value={formData.bankName}
              onChange={e => handleInputChange('bankName', e.target.value)}
              placeholder="Enter bank name"
            />
          </div>
          {/* Account Holder */}
          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              type="text"
              value={formData.accountHolderName}
              onChange={e => handleInputChange('accountHolderName', e.target.value)}
              placeholder="Enter account holder name"
            />
          </div>
          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              type="text"
              value={formData.accountNumber}
              onChange={e => handleInputChange('accountNumber', e.target.value)}
              placeholder="Enter account number"
            />
          </div>
          {/* IFSC Code */}
          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              type="text"
              value={formData.ifscCode}
              onChange={e => handleInputChange('ifscCode', e.target.value)}
              placeholder="Enter IFSC code"
            />
          </div>
        </div>
      </div>

      {/* ── Active Toggle & Actions ───────────────────────────────────────────── */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={e => handleInputChange('isActive', e.target.checked)}
          className="h-4 w-4 text-[#193A9A] border-gray-300 rounded focus:ring-[#193A9A]"
        />
        <Label htmlFor="isActive">User is active</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#193A9A] hover:bg-[#142f7c] text-white"
        >
          {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
