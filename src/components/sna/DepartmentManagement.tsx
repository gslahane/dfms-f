// src/components/DepartmentManagement.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, Users, UserCheck, UserX, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Division {
  id: number;
  divisionName: string;
  districts?: District[];
}

interface District {
  id: number;
  districtName: string;
  divisionId?: number;
}

interface DistrictStaff {
  id: number;
  fullname: string;
  username: string;
  email: string;
  designation: string;
  mobile: number;
  agencyCode: string;
  role: string;
  districtId: number;
  districtName?: string;
  isActive: boolean;
  createdAt: string;
}

interface DistrictStaffForm {
  fullname: string;
  username: string;
  email: string;
  designation: string;
  password: string;
  mobile: string;
  agencyCode: string;
  role: string;
  divisionId: number | null;
  districtId: number | null;
}

const roleOptions = [
  { value: 'DISTRICT_ADMIN', label: 'District Admin' },
  { value: 'DISTRICT_COLLECTOR', label: 'District Collector' },
  { value: 'DISTRICT_DPO', label: 'District DPO' },
  { value: 'DISTRICT_ADPO', label: 'District ADPO' },
  { value: 'DISTRICT_CHECKER', label: 'District Checker' },
  { value: 'DISTRICT_MAKER', label: 'District Maker' }
];

export default function DepartmentManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<DistrictStaff[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<DistrictStaffForm>({
    fullname: '',
    username: '',
    email: '',
    designation: '',
    password: '',
    mobile: '',
    agencyCode: '',
    role: 'DISTRICT_ADMIN',
    divisionId: null,
    districtId: null
  });

  // Fetch divisions
  const fetchDivisions = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/dropdown/divisions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const divisionsData = (response.data || []).map((division: any) => ({
        id: division.id,
        divisionName: division.divisionName || division.name,
        districts: division.districts || []
      }));
      
      setDivisions(divisionsData);
    } catch (err: any) {
      console.error('Error fetching divisions:', err);
      toast({
        title: "Error",
        description: "Failed to fetch divisions",
        variant: "destructive"
      });
    }
  };



  // Fetch district users list
  const fetchDistrictUsers = async () => {
    try {
      setLoading(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/user/district-staff-list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const usersData = (response.data || []).map((userMember: any) => ({
        id: userMember.id,
        fullname: userMember.fullname,
        username: userMember.username,
        email: userMember.email,
        designation: userMember.designation,
        mobile: userMember.mobile,
        agencyCode: userMember.agencyCode,
        role: userMember.role,
        districtId: userMember.districtId,
        districtName: userMember.districtName,
        isActive: userMember.isActive !== false,
        createdAt: userMember.createdAt || new Date().toISOString()
      }));
      
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error fetching district users:', err);
      toast({
        title: "Error",
        description: "Failed to fetch district users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle division change
  const handleDivisionChange = async (divisionId: string) => {
    const selectedDivisionId = parseInt(divisionId);
    setForm(prev => ({ ...prev, divisionId: selectedDivisionId, districtId: null }));
    
    // Fetch districts for selected division
    await fetchDistrictsByDivision(selectedDivisionId);
  };

  // Fetch districts by division ID
  const fetchDistrictsByDivision = async (divisionId: number) => {
    try {
      setLoadingDistricts(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/dropdown/districts?divisionId=${divisionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const districtsData = (response.data || []).map((district: any) => ({
        id: district.id,
        districtName: district.districtName || district.name,
        divisionId: district.divisionId
      }));
      
      setFilteredDistricts(districtsData);
    } catch (err: any) {
      console.error('Error fetching districts for division:', err);
      toast({
        title: "Error",
        description: "Failed to fetch districts for selected division",
        variant: "destructive"
      });
      setFilteredDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // Handle district change
  const handleDistrictChange = (districtId: string) => {
    setForm(prev => ({ ...prev, districtId: parseInt(districtId) }));
  };

  // Create new district user
  const handleCreateUser = async () => {
    try {
      setSubmitting(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const payload = {
        fullname: form.fullname.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        designation: form.designation.trim(),
        password: form.password,
        mobile: parseInt(form.mobile),
        agencyCode: form.agencyCode.trim(),
        role: form.role,
        districtId: form.districtId || 0
      };
      
      const response = await axios.post(`${baseURL}/api/user/district-staff`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setDialogOpen(false);
        resetForm();
        await fetchDistrictUsers();
        toast({
          title: "Success",
          description: "District user created successfully",
          variant: "default"
        });
        // Redirect to main page after successful creation
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error creating district user:', err);
      const errorMessage = err.response?.data?.message || "Failed to create district user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      fullname: '',
      username: '',
      email: '',
      designation: '',
      password: '',
      mobile: '',
      agencyCode: '',
      role: 'DISTRICT_ADMIN',
      divisionId: null,
      districtId: null
    });
    setFilteredDistricts([]);
  };

  const handleFormChange = (key: keyof DistrictStaffForm, value: any) =>
    setForm(f => ({ ...f, [key]: value }));

  const roleOptionsList = useMemo(
    () => ['All', ...new Set(users.map(u => u.role))],
    [users]
  );

  const filteredUsers = useMemo(
    () =>
      users.filter(u =>
        selectedRole === 'All' ? true : u.role === selectedRole
      ),
    [users, selectedRole]
  );

  const total = filteredUsers.length;
  const active = filteredUsers.filter(u => u.isActive).length;
  const inactive = total - active;

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchDivisions(),
        fetchDistrictUsers()
      ]);
    };
    initializeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">Loading district users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">District User Management</h1>
          <p className="text-gray-600">Manage district users and personnel</p>
        </div>
        <div className="flex gap-3 items-end">
          <div className="w-48">
            <Label>Filter by Role</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                {roleOptionsList.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            onClick={async () => {
              await Promise.all([
                fetchDivisions(),
                fetchDistrictUsers()
              ]);
              // Clear filtered districts on refresh
              setFilteredDistricts([]);
            }}
            className="flex items-center px-4 py-2 rounded-sm shadow"
          >
            <RefreshCw className="mr-2 h-4 w-4"/> Refresh All
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center px-4 py-2 rounded-sm shadow">
                <Plus className="mr-2 h-4 w-4"/> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New District User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullname">Full Name *</Label>
                  <Input
                    id="fullname"
                    value={form.fullname}
                    onChange={e => handleFormChange('fullname', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={form.username}
                    onChange={e => handleFormChange('username', e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={e => handleFormChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={form.designation}
                    onChange={e => handleFormChange('designation', e.target.value)}
                    placeholder="Enter designation"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={e => handleFormChange('password', e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    value={form.mobile}
                    onChange={e => handleFormChange('mobile', e.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div>
                  <Label htmlFor="agencyCode">Agency Code *</Label>
                  <Input
                    id="agencyCode"
                    value={form.agencyCode}
                    onChange={e => handleFormChange('agencyCode', e.target.value)}
                    placeholder="Enter agency code"
                  />
                </div>
                <div>
                  <Label htmlFor="division">Division *</Label>
                  <Select
                    value={form.divisionId?.toString() || ''}
                    onValueChange={handleDivisionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map(division => (
                        <SelectItem key={division.id} value={division.id.toString()}>
                          {division.divisionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Select
                    value={form.districtId?.toString() || ''}
                    onValueChange={handleDistrictChange}
                    disabled={!form.divisionId || loadingDistricts}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !form.divisionId ? "Select division first" : 
                        loadingDistricts ? "Loading districts..." : 
                        "Select district"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingDistricts ? (
                        <div className="flex items-center justify-center py-2">
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          <span className="text-sm text-gray-500">Loading districts...</span>
                        </div>
                      ) : filteredDistricts.length === 0 ? (
                        <div className="py-2 px-3 text-sm text-gray-500">
                          No districts found for selected division
                        </div>
                      ) : (
                        filteredDistricts.map(district => (
                          <SelectItem key={district.id} value={district.id.toString()}>
                            {district.districtName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) => handleFormChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">
                    Select a division to load its districts. Districts will be fetched automatically based on your selection.
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateUser}
                  disabled={submitting}
                >
                  {submitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{active}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
          <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{inactive}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Table */}
      <Card className="border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">District Users Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {['S.No','Name','Username','Email','Designation','District','Mobile','Role','Status','Actions'].map(h => (
                  <th
                    key={h}
                    className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 text-sm">{idx + 1}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">
                    <div>
                      <div className="font-medium">{user.fullname}</div>
                      <div className="text-xs text-gray-500">{user.agencyCode}</div>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">
                    <div className="font-mono text-xs">{user.username}</div>
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{user.email}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{user.designation}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">
                    <div className="text-sm">{user.districtName || 'N/A'}</div>
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{user.mobile}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="border open:bg-gray-200 px-3 py-2 text-sm">
                    <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={10} className="border border-gray-200 py-4 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center space-y-2">
                      <Users className="w-6 h-6 text-gray-400" />
                      <p>No users found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
