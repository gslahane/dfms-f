import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Eye, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface IAUser {
  id?: number;
  fullname: string;
  username: string;
  email: string;
  designation: string;
  mobile: number;
  agencyCode: string;
  role: "IA_ADMIN";
  districtId: number;
  status?: string;
  createdAt?: string;
}

interface IAFormData {
  fullname: string;
  username: string;
  email: string;
  designation: string;
  password: string;
  mobile: string;
  agencyCode: string;
}

export default function ImplementingAgencyMaster() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [iaUsers, setIaUsers] = useState<IAUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<IAFormData>({
    fullname: '',
    username: '',
    email: '',
    designation: '',
    password: '',
    mobile: '',
    agencyCode: ''
  });
  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch IA users (if you have an endpoint to get existing IA users)
  const fetchIAUsers = async () => {
    try {
      setLoading(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      // Assuming there's an endpoint to get IA users
      const response = await axios.get(`${baseURL}/api/user/ia`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setIaUsers(response.data || []);
    } catch (err: any) {
      console.error('Error fetching IA users:', err);
      toast({
        title: "Error",
        description: "Failed to fetch IA users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIAUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(""); // Clear errors when user types
  };

  const validateForm = (): boolean => {
    if (!form.fullname.trim()) {
      setErrors("Full name is required.");
      return false;
    }
    if (!form.username.trim()) {
      setErrors("Username is required.");
      return false;
    }
    if (!form.email.trim()) {
      setErrors("Email is required.");
      return false;
    }
    if (!form.designation.trim()) {
      setErrors("Designation is required.");
      return false;
    }
    if (!form.password.trim()) {
      setErrors("Password is required.");
      return false;
    }
    if (form.password.length < 6) {
      setErrors("Password must be at least 6 characters long.");
      return false;
    }
    if (!form.mobile.trim()) {
      setErrors("Mobile number is required.");
      return false;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      setErrors("Mobile number must be 10 digits.");
      return false;
    }
    if (!form.agencyCode.trim()) {
      setErrors("Agency code is required.");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setErrors("");
      
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
        role: "IA_ADMIN" as const,
        districtId: user?.districtId || 0
      };
      
      const response = await axios.post(`${baseURL}/api/user/ia`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast({
        title: "Success",
        description: "IA user created successfully",
        variant: "default"
      });
      
      // Reset form and close modal
      setForm({
        fullname: '',
        username: '',
        email: '',
        designation: '',
        password: '',
        mobile: '',
        agencyCode: ''
      });
      setModalOpen(false);
      
      // Refresh the list
      fetchIAUsers();
      
    } catch (err: any) {
      console.error('Error creating IA user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create IA user';
      setErrors(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this IA user?")) {
      return;
    }
    
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      await axios.delete(`${baseURL}/api/user/ia/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast({
        title: "Success",
        description: "IA user deleted successfully",
        variant: "default"
      });
      
      // Refresh the list
      fetchIAUsers();
      
    } catch (err: any) {
      console.error('Error deleting IA user:', err);
      toast({
        title: "Error",
        description: "Failed to delete IA user",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">Loading IA users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-semibold">Implementing Agency Master</CardTitle>
          <p className="text-gray-600 mt-1">Create and manage IA user accounts</p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} disabled={submitting}>
          <Plus className="mr-1 h-4 w-4" /> Add IA User
        </Button>
      </div>

      <Card className="border border-gray-300 rounded-lg shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {['Sr No','Full Name','Username','Email','Designation','Mobile','Agency Code','Status','Actions'].map((h, idx) => (
                    <TableHead key={idx} className="border border-gray-200 px-4 py-2 text-left text-xs font-semibold text-gray-700">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {iaUsers.map((iaUser, idx) => (
                  <TableRow key={iaUser.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{idx + 1}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{iaUser.fullname}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{iaUser.username}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{iaUser.email}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{iaUser.designation}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{iaUser.mobile}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">{iaUser.agencyCode}</TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm">
                      <Badge className={iaUser.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {iaUser.status || 'ACTIVE'}
                      </Badge>
                    </TableCell>
                    <TableCell className="border border-gray-200 px-4 py-2 text-sm space-x-2">
                      <Button size="icon" variant="ghost"><Eye className="h-5 w-5 text-blue-600"/></Button>
                      {iaUser.id && (
                        <Button size="icon" variant="ghost" onClick={() => handleRemove(iaUser.id!)}>
                          <Trash2 className="h-5 w-5 text-red-600"/>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {iaUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="border border-gray-200 py-6 text-center text-gray-500">
                      No IA users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add IA User</DialogTitle>
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4">
              <X className="h-5 w-5 text-gray-500 hover:text-red-600" />
            </button>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="fullname" 
                  value={form.fullname} 
                  onChange={handleChange}
                  placeholder="Enter full name"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange}
                  placeholder="Enter username"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="Enter email address"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="designation" 
                  value={form.designation} 
                  onChange={handleChange}
                  placeholder="Enter designation"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="mobile" 
                  value={form.mobile} 
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Agency Code <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="agencyCode" 
                  value={form.agencyCode} 
                  onChange={handleChange}
                  placeholder="Enter agency code"
                  disabled={submitting}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input 
                  name="password" 
                  type="password"
                  value={form.password} 
                  onChange={handleChange}
                  placeholder="Enter password (minimum 6 characters)"
                  disabled={submitting}
                />
              </div>
              <div className="sm:col-span-2">
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-700">
                      District ID will be automatically set to: <strong>{user?.districtName || 'Current logged-in district'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {errors && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700">{errors}</span>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAdd}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create IA User'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}