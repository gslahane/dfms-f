import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  TableCell,
  TableFooter
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Users, 
  UserCheck, 
  UserX,
  Search,
  Download,
  RefreshCw,
  Pencil,
  Crown,
  GraduationCap
} from 'lucide-react';

// Types
interface District {
  id: number;
  name: string;
}

interface Constituency {
  id: number;
  name: string;
  districtId: number;
}

interface FinancialYear {
  id: number;
  name: string;
}

interface MLAUser {
  id: number;
  type: 'MLA';
  fullname: string;
  username: string;
  email: string;
  password: string;
  mobile: number;
  districtId: number;
  districtName: string;
  mlaName: string;
  mlaParty: string;
  mlaContactNumber: string;
  mlaEmail: string;
  mlaTerm: number;
  constituencyId: number;
  constituencyName: string;
  isActive: boolean;
  createdAt: string;
}

interface MLCUser {
  id: number;
  type: 'MLC';
  fullname: string;
  username: string;
  email: string;
  password: string;
  mobile: number;
  districtId: number;
  districtName: string;
  mlcName: string;
  mlcCategory: string;
  mlcContactNumber: string;
  mlcEmail: string;
  mlcTerm: number;
  mlcRegion: string;
  isActive: boolean;
  createdAt: string;
}

type UserRecord = MLAUser | MLCUser;

// MLA Form Interface - Only relevant fields
interface MLAForm {
  fullname: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  districtId: number | null;
  mlaName: string;
  mlaParty: string;
  mlaContactNumber: string;
  mlaEmail: string;
  mlaTerm: number | null;
  constituencyId: number | null;
}

// MLC Form Interface - Only relevant fields
interface MLCForm {
  fullname: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
  districtId: number | null;
  mlcName: string;
  mlcCategory: string;
  mlcContactNumber: string;
  mlcEmail: string;
  mlcTerm: number | null;
  mlcRegion: string;
}

interface DeactivationForm {
  remark: string;
  deactivationLetter: File | null;
}

export default function MlaRegister() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  
  // Form states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deactivationDialogOpen, setDeactivationDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [selectedType, setSelectedType] = useState<'MLA' | 'MLC'>('MLA');
  
  // MLA Form - Clean fields only
  const [mlaForm, setMlaForm] = useState<MLAForm>({
    fullname: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    districtId: null,
    mlaName: '',
    mlaParty: '',
    mlaContactNumber: '',
    mlaEmail: '',
    mlaTerm: null,
    constituencyId: null
  });

  // MLC Form - Clean fields only
  const [mlcForm, setMlcForm] = useState<MLCForm>({
    fullname: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    districtId: null,
    mlcName: '',
    mlcCategory: '',
    mlcContactNumber: '',
    mlcEmail: '',
    mlcTerm: null,
    mlcRegion: ''
  });
  
  const [deactivationForm, setDeactivationForm] = useState<DeactivationForm>({
    remark: '',
    deactivationLetter: null
  });
  
  // Filter states
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingConstituencies, setLoadingConstituencies] = useState(false);

  // Fetch districts dropdown
  const fetchDistricts = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/dropdown/districts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDistricts(response.data || []);
    } catch (err: any) {
      console.error('Error fetching districts:', err);
    }
  };

  // Fetch constituencies by district
  const fetchConstituencies = async (districtId: number) => {
    try {
      setLoadingConstituencies(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/dropdown/constituencies/by-district/${districtId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setConstituencies(response.data || []);
    } catch (err: any) {
      console.error('Error fetching constituencies:', err);
      setConstituencies([]);
    } finally {
      setLoadingConstituencies(false);
    }
  };

  // Fetch financial years dropdown
  const fetchFinancialYears = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/dropdown/financial-years`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setFinancialYears(response.data || []);
    } catch (err: any) {
      console.error('Error fetching financial years:', err);
    }
  };

  // Fetch MLA users
  const fetchMLAUsers = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/user/mlas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        const mlaUsers = response.data.data || [];
        setUsers(prev => {
          const filtered = prev.filter(u => u.type !== 'MLA');
          return [...filtered, ...mlaUsers];
        });
      }
    } catch (err: any) {
      console.error('Error fetching MLA users:', err);
    }
  };

  // Fetch MLC users
  const fetchMLCUsers = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/api/user/mlc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        const mlcUsers = response.data.data || [];
        setUsers(prev => {
          const filtered = prev.filter(u => u.type !== 'MLC');
          return [...filtered, ...mlcUsers];
        });
      }
    } catch (err: any) {
      console.error('Error fetching MLC users:', err);
    }
  };

  // Create new user
  const handleCreateUser = async () => {
    try {
      setSubmitting(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      let payload: any;
      let endpoint: string;

      if (selectedType === 'MLA') {
        payload = {
          fullname: mlaForm.fullname,
          username: mlaForm.username,
          email: mlaForm.email,
          password: mlaForm.password,
          mobile: parseInt(mlaForm.mobile) || 0,
          districtId: mlaForm.districtId,
          mlaName: mlaForm.mlaName,
          mlaParty: mlaForm.mlaParty,
          mlaContactNumber: mlaForm.mlaContactNumber,
          mlaEmail: mlaForm.mlaEmail,
          mlaTerm: mlaForm.mlaTerm,
          constituencyId: mlaForm.constituencyId
        };
        endpoint = '/api/user/mlas';
      } else {
        payload = {
          fullname: mlcForm.fullname,
          username: mlcForm.username,
          email: mlcForm.email,
          password: mlcForm.password,
          mobile: parseInt(mlcForm.mobile) || 0,
          districtId: mlcForm.districtId,
          mlcName: mlcForm.mlcName,
          mlcCategory: mlcForm.mlcCategory,
          mlcContactNumber: mlcForm.mlcContactNumber,
          mlcEmail: mlcForm.mlcEmail,
          mlcTerm: mlcForm.mlcTerm,
          mlcRegion: mlcForm.mlcRegion
        };
        endpoint = '/api/user/mlc';
      }
      
      const response = await axios.post(`${baseURL}${endpoint}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCreateDialogOpen(false);
        resetForms();
        fetchMLAUsers();
        fetchMLCUsers();
      }
    } catch (err: any) {
      console.error('Error creating user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Activate user
  const handleActivateUser = async (userId: number, type: 'MLA' | 'MLC') => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const endpoint = type === 'MLA' 
        ? `/api/admin/mlas/${userId}/status`
        : `/api/admin/mlc/${userId}/activate`;
      
      const method = type === 'MLA' ? 'PATCH' : 'POST';
      const payload = type === 'MLA' ? { isActive: true } : {};
      
      const response = await axios({
        method,
        url: `${baseURL}${endpoint}`,
        data: payload,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        fetchMLAUsers();
        fetchMLCUsers();
      }
    } catch (err: any) {
      console.error('Error activating user:', err);
    }
  };

  // Deactivate user
  const handleDeactivateUser = async () => {
    if (!selectedUser) return;
    
    try {
      setSubmitting(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append('remark', deactivationForm.remark);
      if (deactivationForm.deactivationLetter) {
        formData.append('deactivationLetter', deactivationForm.deactivationLetter);
      }
      
      const endpoint = selectedUser.type === 'MLA' 
        ? `/api/admin/mlas/${selectedUser.id}/status`
        : `/api/admin/mlc/${selectedUser.id}/deactivate`;
      
      const method = selectedUser.type === 'MLA' ? 'PATCH' : 'POST';
      const payload = selectedUser.type === 'MLA' 
        ? { isActive: false, remark: deactivationForm.remark }
        : formData;
      
      const headers = selectedUser.type === 'MLA' 
        ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        : {
            'Authorization': `Bearer ${token}`
          };
      
      const response = await axios({
        method,
        url: `${baseURL}${endpoint}`,
        data: payload,
        headers
      });

      if (response.data.success) {
        setDeactivationDialogOpen(false);
        resetDeactivationForm();
        fetchMLAUsers();
        fetchMLCUsers();
      }
    } catch (err: any) {
      console.error('Error deactivating user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset forms
  const resetForms = () => {
    setMlaForm({
      fullname: '',
      username: '',
      email: '',
      password: '',
      mobile: '',
      districtId: null,
      mlaName: '',
      mlaParty: '',
      mlaContactNumber: '',
      mlaEmail: '',
      mlaTerm: null,
      constituencyId: null
    });
    setMlcForm({
      fullname: '',
      username: '',
      email: '',
      password: '',
      mobile: '',
      districtId: null,
      mlcName: '',
      mlcCategory: '',
      mlcContactNumber: '',
      mlcEmail: '',
      mlcTerm: null,
      mlcRegion: ''
    });
  };

  const resetDeactivationForm = () => {
    setDeactivationForm({
      remark: '',
      deactivationLetter: null
    });
  };

  // Handle district change
  const handleDistrictChange = (districtId: number) => {
    if (selectedType === 'MLA') {
      setMlaForm(prev => ({ ...prev, districtId, constituencyId: null }));
    } else {
      setMlcForm(prev => ({ ...prev, districtId }));
    }
    if (districtId) {
      fetchConstituencies(districtId);
    } else {
      setConstituencies([]);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesDistrict = filterDistrict === 'all' || user.districtId.toString() === filterDistrict;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isActive) || 
      (filterStatus === 'inactive' && !user.isActive);
    const matchesSearch = searchTerm === '' || 
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesDistrict && matchesStatus && matchesSearch;
  });

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDistricts(),
        fetchFinancialYears(),
        fetchMLAUsers(),
        fetchMLCUsers()
      ]);
      setLoading(false);
    };
    initializeData();
  }, []);

  // Helper functions
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getTypeBadge = (type: 'MLA' | 'MLC') => {
    return type === 'MLA' ? (
      <Badge className="bg-blue-100 text-blue-800">
        <Crown className="w-3 h-3 mr-1" />
        MLA
      </Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800">
        <GraduationCap className="w-3 h-3 mr-1" />
        MLC
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">Loading MLA/MLC registry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">MLA/MLC Registry</h1>
          <p className="text-gray-600 mt-1">Manage MLA and MLC user registrations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => { fetchMLAUsers(); fetchMLCUsers(); }} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Register MLA/MLC
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register New {selectedType}</DialogTitle>
                <DialogDescription>
                  Create a new {selectedType} user account with all required details.
                </DialogDescription>
              </DialogHeader>
              
              {/* Type Selection */}
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <Button
                  type="button"
                  variant={selectedType === 'MLA' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('MLA')}
                  className="flex-1"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  MLA
                </Button>
                <Button
                  type="button"
                  variant={selectedType === 'MLC' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('MLC')}
                  className="flex-1"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  MLC
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Common Fields */}
                {/* <div>
                  <Label htmlFor="fullname">Full Name *</Label>
                  <Input
                    id="fullname"
                    value={selectedType === 'MLA' ? mlaForm.fullname : mlcForm.fullname}
                    onChange={(e) => {
                      if (selectedType === 'MLA') {
                        setMlaForm(prev => ({ ...prev, fullname: e.target.value }));
                      } else {
                        setMlcForm(prev => ({ ...prev, fullname: e.target.value }));
                      }
                    }}
                    placeholder="Enter full name"
                  />
                </div> */}
                                {selectedType === 'MLA' && (
                  <>
                    <div>
                      <Label htmlFor="mlaName">MLA Name *</Label>
                      <Input
                        id="mlaName"
                        value={mlaForm.mlaName}
                        onChange={(e) => setMlaForm(prev => ({ ...prev, mlaName: e.target.value }))}
                        placeholder="Enter MLA name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlaParty">MLA Party *</Label>
                      <Input
                        id="mlaParty"
                        value={mlaForm.mlaParty}
                        onChange={(e) => setMlaForm(prev => ({ ...prev, mlaParty: e.target.value }))}
                        placeholder="Enter MLA party"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlaContactNumber">MLA Contact Number *</Label>
                      <Input
                        id="mlaContactNumber"
                        value={mlaForm.mlaContactNumber}
                        onChange={(e) => setMlaForm(prev => ({ ...prev, mlaContactNumber: e.target.value }))}
                        placeholder="Enter MLA contact number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlaEmail">MLA Email *</Label>
                      <Input
                        id="mlaEmail"
                        type="email"
                        value={mlaForm.mlaEmail}
                        onChange={(e) => setMlaForm(prev => ({ ...prev, mlaEmail: e.target.value }))}
                        placeholder="Enter MLA email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlaTerm">MLA Term *</Label>
                      <Select 
                        value={mlaForm.mlaTerm?.toString() || ''} 
                        onValueChange={(value) => setMlaForm(prev => ({ ...prev, mlaTerm: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select MLA term" />
                        </SelectTrigger>
                        <SelectContent>
                          {financialYears.map((fy) => (
                            <SelectItem key={fy.id} value={fy.id.toString()}>
                              {fy.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                  <Label htmlFor="district">District *</Label>
                  <Select 
                    value={(selectedType === 'MLA' ? mlaForm.districtId : mlcForm.districtId)?.toString() || ''} 
                    onValueChange={(value) => handleDistrictChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                    <div>
                      <Label htmlFor="constituency">Constituency *</Label>
                      <Select 
                        value={mlaForm.constituencyId?.toString() || ''} 
                        onValueChange={(value) => setMlaForm(prev => ({ ...prev, constituencyId: parseInt(value) }))}
                        disabled={!mlaForm.districtId || loadingConstituencies}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingConstituencies ? "Loading..." : "Select constituency"} />
                        </SelectTrigger>
                        <SelectContent>
                          {constituencies.map((constituency) => (
                            <SelectItem key={constituency.id} value={constituency.id.toString()}>
                              {constituency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* MLC Specific Fields */}
                {selectedType === 'MLC' && (
                  <>
                    <div>
                      <Label htmlFor="mlcName">MLC Name *</Label>
                      <Input
                        id="mlcName"
                        value={mlcForm.mlcName}
                        onChange={(e) => setMlcForm(prev => ({ ...prev, mlcName: e.target.value }))}
                        placeholder="Enter MLC name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlcCategory">MLC Category *</Label>
                      <Input
                        id="mlcCategory"
                        value={mlcForm.mlcCategory}
                        onChange={(e) => setMlcForm(prev => ({ ...prev, mlcCategory: e.target.value }))}
                        placeholder="Enter MLC category"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlcContactNumber">MLC Contact Number *</Label>
                      <Input
                        id="mlcContactNumber"
                        value={mlcForm.mlcContactNumber}
                        onChange={(e) => setMlcForm(prev => ({ ...prev, mlcContactNumber: e.target.value }))}
                        placeholder="Enter MLC contact number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlcEmail">MLC Email *</Label>
                      <Input
                        id="mlcEmail"
                        type="email"
                        value={mlcForm.mlcEmail}
                        onChange={(e) => setMlcForm(prev => ({ ...prev, mlcEmail: e.target.value }))}
                        placeholder="Enter MLC email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mlcTerm">MLC Term *</Label>
                      <Select 
                        value={mlcForm.mlcTerm?.toString() || ''} 
                        onValueChange={(value) => setMlcForm(prev => ({ ...prev, mlcTerm: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select MLC term" />
                        </SelectTrigger>
                        <SelectContent>
                          {financialYears.map((fy) => (
                            <SelectItem key={fy.id} value={fy.id.toString()}>
                              {fy.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mlcRegion">MLC Region *</Label>
                      <Input
                        id="mlcRegion"
                        value={mlcForm.mlcRegion}
                        onChange={(e) => setMlcForm(prev => ({ ...prev, mlcRegion: e.target.value }))}
                        placeholder="Enter MLC region"
                      />
                    </div>
                  </>
                )}

                

                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={selectedType === 'MLA' ? mlaForm.username : mlcForm.username}
                    onChange={(e) => {
                      if (selectedType === 'MLA') {
                        setMlaForm(prev => ({ ...prev, username: e.target.value }));
                      } else {
                        setMlcForm(prev => ({ ...prev, username: e.target.value }));
                      }
                    }}
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={selectedType === 'MLA' ? mlaForm.email : mlcForm.email}
                    onChange={(e) => {
                      if (selectedType === 'MLA') {
                        setMlaForm(prev => ({ ...prev, email: e.target.value }));
                      } else {
                        setMlcForm(prev => ({ ...prev, email: e.target.value }));
                      }
                    }}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={selectedType === 'MLA' ? mlaForm.password : mlcForm.password}
                    onChange={(e) => {
                      if (selectedType === 'MLA') {
                        setMlaForm(prev => ({ ...prev, password: e.target.value }));
                      } else {
                        setMlcForm(prev => ({ ...prev, password: e.target.value }));
                      }
                    }}
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    value={selectedType === 'MLA' ? mlaForm.mobile : mlcForm.mobile}
                    onChange={(e) => {
                      if (selectedType === 'MLA') {
                        setMlaForm(prev => ({ ...prev, mobile: e.target.value }));
                      } else {
                        setMlcForm(prev => ({ ...prev, mobile: e.target.value }));
                      }
                    }}
                    placeholder="Enter mobile number"
                  />
                </div>


                {/* MLA Specific Fields */}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateUser} 
                  disabled={submitting}
                >
                  {submitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Register {selectedType}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{users.filter(u => !u.isActive).length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Districts</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{new Set(users.map(u => u.districtId)).size}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="MLA">MLA</SelectItem>
                  <SelectItem value="MLC">MLC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="district-filter">District</Label>
              <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base sm:text-lg">Registered MLA/MLC Users</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Sr No</TableHead>
                  <TableHead className="text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="text-xs sm:text-sm">Name</TableHead>
                  <TableHead className="text-xs sm:text-sm">District</TableHead>
                  <TableHead className="text-xs sm:text-sm">Contact</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm">Created</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-xs sm:text-sm">{index + 1}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{getTypeBadge(user.type)}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div>
                        <div className="font-medium">{user.fullname}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{user.districtName}</TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      <div>
                        <div>{user.mobile}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{getStatusBadge(user.isActive)}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                        {user.isActive ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                                className="h-8 w-8 p-0"
                              >
                                <UserX className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to deactivate {user.fullname}? This action requires a remark and deactivation letter.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="remark">Deactivation Remark *</Label>
                                  <Textarea
                                    id="remark"
                                    value={deactivationForm.remark}
                                    onChange={(e) => setDeactivationForm(prev => ({ ...prev, remark: e.target.value }))}
                                    placeholder="Enter reason for deactivation"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="deactivationLetter">Deactivation Letter *</Label>
                                  <Input
                                    id="deactivationLetter"
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={(e) => setDeactivationForm(prev => ({ 
                                      ...prev, 
                                      deactivationLetter: e.target.files?.[0] || null 
                                    }))}
                                  />
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => resetDeactivationForm()}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeactivateUser}
                                  disabled={!deactivationForm.remark || !deactivationForm.deactivationLetter}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Deactivate
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActivateUser(user.id, user.type)}
                            className="h-8 w-8 p-0"
                          >
                            <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredUsers.length === 0 && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        <p className="text-gray-500 text-sm sm:text-base">No users found</p>
                        <p className="text-xs sm:text-sm text-gray-400">Try adjusting your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
