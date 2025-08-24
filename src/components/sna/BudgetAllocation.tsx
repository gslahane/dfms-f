import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Plus, Users, UserCheck, UserX, AlertCircle, Edit } from "lucide-react";

// Interfaces
interface FinancialYear {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
}

interface Constituency {
  id: number;
  name: string;
  districtId: number;
}

interface Taluka {
  id: number;
  name: string;
  districtId: number;
}

interface MLA {
  id: number;
  mlaName: string;
  party: string;
  constituencyName: string;
  constituencyId: number;
  districtName: string;
  status: string;
}

interface MLC {
  id: number;
  mlcName: string;
  category: string;
  region: string;
  status: string;
}

interface Scheme {
  id?: number;
  name?: string;
  schemeName?: string;
}



interface MLABudget {
  id: number;
  mlaId: number;
  mlaName: string;
  financialYearId: number;
  financialYear: string;
  districtId: number;
  districtName: string;
  constituencyId: number;
  constituencyName: string;
  schemeId: number;
  schemeName: string;
  allocatedLimit: number;
  remarks: string;
  status: string;
  createdAt: string;
}

interface MLCBudget {
  id: number;
  mlcId: number;
  mlcName: string;
  financialYearId: number;
  financialYear: string;
  districtId: number;
  districtName: string;
  schemeId: number;
  schemeName: string;
  allocatedLimit: number;
  remarks: string;
  status: string;
  createdAt: string;
}

interface HADPBudget {
  id: number;
  financialYearId: number;
  financialYear: string;
  districtId: number;
  districtName: string;
  talukaId: number;
  talukaName: string;
  schemeId: number;
  schemeName: string;
  allocatedLimit: number;
  remarks: string;
  status: string;
  createdAt: string;
}

interface BudgetForm {
  financialYearId: number | null;
  districtId: number | null;
  constituencyId: number | null;
  talukaId: number | null;
  schemeId: number | null;
  selectedMLAs: number[];
  selectedMLCs: number[];
  allocatedLimit: string;
  remarks: string;
  mlaSelectionMode: 'direct' | 'constituency';
}

const BudgetAllocation: React.FC = () => {
  const { toast } = useToast();

  // State for dropdown data
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [talukas, setTalukas] = useState<Taluka[]>([]);
  const [schemes, setSchemes] = useState<(Scheme | string)[]>([]);
  const [mlas, setMlas] = useState<MLA[]>([]);
  const [mlcs, setMlcs] = useState<MLC[]>([]);

  // State for budget data
  const [mlaBudgets, setMlaBudgets] = useState<MLABudget[]>([]);
  const [mlcBudgets, setMlcBudgets] = useState<MLCBudget[]>([]);
  const [hadpBudgets, setHadpBudgets] = useState<HADPBudget[]>([]);

  // State for form
  const [form, setForm] = useState<BudgetForm>({
    financialYearId: null,
    districtId: null,
    constituencyId: null,
    talukaId: null,
    schemeId: null,
    selectedMLAs: [],
    selectedMLCs: [],
    allocatedLimit: "",
    remarks: "",
    mlaSelectionMode: 'direct'
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingConstituencies, setLoadingConstituencies] = useState(false);
  const [loadingTalukas, setLoadingTalukas] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filter states
  const [selectedPlanType, setSelectedPlanType] = useState<'MLA' | 'MLC' | 'HADP'>('MLA');
  const [filterFinancialYear, setFilterFinancialYear] = useState<string>('All');
  const [filterDistrict, setFilterDistrict] = useState<string>('All');
  
  // Budget fetch states
  const [selectedFetchFinancialYear, setSelectedFetchFinancialYear] = useState<number | null>(null);
  
  // Popup form states
  const [showMLAPopup, setShowMLAPopup] = useState(false);
  const [showMLCPopup, setShowMLCPopup] = useState(false);
  const [showHADPPopup, setShowHADPPopup] = useState(false);
  const [showAddBudgetPopup, setShowAddBudgetPopup] = useState(false);
  const [selectedBudgetForEdit, setSelectedBudgetForEdit] = useState<any>(null);

  // Fetch financial years
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
      toast({
        title: "Error",
        description: "Failed to fetch financial years",
        variant: "destructive"
      });
    }
  };

  // Fetch districts
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
      toast({
        title: "Error",
        description: "Failed to fetch districts",
        variant: "destructive"
      });
    }
  };

  // Fetch schemes
  const fetchSchemes = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/dropdown/schemes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSchemes(response.data || []);
    } catch (err: any) {
      console.error('Error fetching schemes:', err);
      toast({
        title: "Error",
        description: "Failed to fetch schemes",
        variant: "destructive"
      });
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
      toast({
        title: "Error",
        description: "Failed to fetch constituencies",
        variant: "destructive"
      });
      setConstituencies([]);
    } finally {
      setLoadingConstituencies(false);
    }
  };

  // Fetch talukas by district
  const fetchTalukas = async (districtId: number) => {
    try {
      setLoadingTalukas(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/dropdown/talukas/by-district/${districtId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setTalukas(response.data || []);
    } catch (err: any) {
      console.error('Error fetching talukas:', err);
      toast({
        title: "Error",
        description: "Failed to fetch talukas",
        variant: "destructive"
      });
      setTalukas([]);
    } finally {
      setLoadingTalukas(false);
    }
  };

  // Fetch MLAs by district
  const fetchMLAsByDistrict = async (districtId: number) => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/admin/mlas/by-district/${districtId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const mlaData = (response.data || []).map((mla: any) => ({
        id: mla.id,
        mlaName: mla.mlaName,
        party: mla.party,
        constituencyName: mla.constituencyName,
        constituencyId: mla.constituencyId,
        districtName: mla.districtName,
        status: mla.status
      }));
      
      setMlas(mlaData);
    } catch (err: any) {
      console.error('Error fetching MLAs by district:', err);
      toast({
        title: "Error",
        description: "Failed to fetch MLAs for selected district",
        variant: "destructive"
      });
      setMlas([]);
    }
  };

  // Fetch MLCs
  const fetchMLCs = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/admin/mlc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const mlcData = (response.data || []).map((mlc: any) => ({
        id: mlc.id,
        mlcName: mlc.mlcName,
        category: mlc.category,
        region: mlc.region,
        status: mlc.status
      }));
      
      setMlcs(mlcData);
    } catch (err: any) {
      console.error('Error fetching MLCs:', err);
      toast({
        title: "Error",
        description: "Failed to fetch MLCs",
        variant: "destructive"
      });
    }
  };

  // Fetch MLA budgets
  const fetchMLABudgets = async (financialYearId?: number) => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive"
        });
        return;
      }

      const params = financialYearId ? { financialYearId } : {};
      
      const response = await axios.get(`${baseURL}/api/mla-budget/fetch`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      });
      
      setMlaBudgets(response.data || []);
    } catch (err: any) {
      console.error('Error fetching MLA budgets:', err);
      toast({
        title: "Error",
        description: "Failed to fetch MLA budgets",
        variant: "destructive"
      });
    }
  };

  // Fetch MLC budgets
  const fetchMLCBudgets = async (financialYearId?: number) => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive"
        });
        return;
      }

      const params = financialYearId ? { financialYearId } : {};
      
      const response = await axios.get(`${baseURL}/api/mlc-budget/getMLCBudgets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      });
      
      setMlcBudgets(response.data || []);
    } catch (err: any) {
      console.error('Error fetching MLC budgets:', err);
      toast({
        title: "Error",
        description: "Failed to fetch MLC budgets",
        variant: "destructive"
      });
    }
  };

  // Fetch HADP budgets
  const fetchHADPBudgets = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${baseURL}/api/hadp-budget/fetch`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setHadpBudgets(response.data || []);
    } catch (err: any) {
      console.error('Error fetching HADP budgets:', err);
      toast({
        title: "Error",
        description: "Failed to fetch HADP budgets",
        variant: "destructive"
      });
    }
  };

  // Handle district change
  const handleDistrictChange = (districtId: string) => {
    const selectedDistrictId = parseInt(districtId);
    setForm(prev => ({ 
      ...prev, 
      districtId: selectedDistrictId, 
      constituencyId: null,
      talukaId: null,
      selectedMLAs: [],
      selectedMLCs: []
    }));
    
    if (selectedDistrictId) {
      if (selectedPlanType === 'MLA') {
        fetchConstituencies(selectedDistrictId);
        fetchMLAsByDistrict(selectedDistrictId);
      } else if (selectedPlanType === 'HADP') {
        fetchTalukas(selectedDistrictId);
      } else if (selectedPlanType === 'MLC') {
        // For MLC, we might need to fetch MLCs by district if needed
      }
    } else {
      setConstituencies([]);
      setTalukas([]);
      setMlas([]);
      setMlcs([]);
    }
  };

  // Handle MLA selection
  const handleMLASelection = (mlaId: number, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      selectedMLAs: checked 
        ? [...prev.selectedMLAs, mlaId]
        : prev.selectedMLAs.filter(id => id !== mlaId)
    }));
  };

  // Handle MLC selection
  const handleMLCSelection = (mlcId: number, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      selectedMLCs: checked 
        ? [...prev.selectedMLCs, mlcId]
        : prev.selectedMLCs.filter(id => id !== mlcId)
    }));
  };

  // Handle budget editing
  const handleEditBudget = (budget: any, type: 'MLA' | 'MLC' | 'HADP') => {
    setSelectedBudgetForEdit(budget);
    if (type === 'MLA') {
      setShowMLAPopup(true);
    } else if (type === 'MLC') {
      setShowMLCPopup(true);
    } else if (type === 'HADP') {
      setShowHADPPopup(true);
    }
  };

  // Handle budget update
  const handleUpdateBudget = async (type: 'MLA' | 'MLC' | 'HADP') => {
    if (!selectedBudgetForEdit || !form.allocatedLimit) {
      toast({
        title: "Validation Error",
        description: "Please enter an allocated limit",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const allocatedLimit = parseFloat(form.allocatedLimit);

      if (type === 'MLA') {
        await axios.put(`${baseURL}/api/mla-budget/update/${selectedBudgetForEdit.id}`, {
          allocatedLimit
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        await fetchMLABudgets(selectedFetchFinancialYear || undefined);
        setShowMLAPopup(false);
      } else if (type === 'MLC') {
        await axios.put(`${baseURL}/api/mlc-budget/update/${selectedBudgetForEdit.id}`, {
          allocatedLimit
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        await fetchMLCBudgets(selectedFetchFinancialYear || undefined);
        setShowMLCPopup(false);
      } else if (type === 'HADP') {
        await axios.put(`${baseURL}/api/hadp-budget/update/${selectedBudgetForEdit.id}`, {
          allocatedLimit
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        await fetchHADPBudgets();
        setShowHADPPopup(false);
      }

      toast({
        title: "Success",
        description: `${type} budget updated successfully`,
        variant: "default"
      });

      setSelectedBudgetForEdit(null);
      setForm(prev => ({ ...prev, allocatedLimit: "" }));

    } catch (err: any) {
      console.error('Error updating budget:', err);
      const errorMessage = err.response?.data?.message || "Failed to update budget";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!form.financialYearId || !form.districtId || !form.allocatedLimit || !form.schemeId || 
        form.districtId === 0 || form.financialYearId === 0) {
      
      // Additional validation for MLA constituency mode
      if (selectedPlanType === 'MLA' && form.mlaSelectionMode === 'constituency' && !form.constituencyId) {
        toast({
          title: "Validation Error",
          description: "Please select a constituency for MLA budget allocation",
          variant: "destructive"
        });
        return;
      }
      toast({
        title: "Validation Error",
        description: "Please fill all required fields (Financial Year, District, Scheme, Allocated Limit)",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlanType === 'MLA' && form.selectedMLAs.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one MLA",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlanType === 'MLC' && form.selectedMLCs.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one MLC",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlanType === 'HADP' && !form.talukaId) {
      toast({
        title: "Validation Error",
        description: "Please select a taluka for HADP allocation",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const allocatedLimit = parseFloat(form.allocatedLimit);

      if (selectedPlanType === 'MLA') {
        // Submit MLA budgets
        const mlaPromises = form.selectedMLAs.map(mlaId => {
          const payload = {
            financialYearId: form.financialYearId,
            mlaId,
            constituencyId: form.constituencyId,
            allocatedLimit,
            remarks: form.remarks,
            schemeId: form.schemeId
          };
          
          return axios.post(`${baseURL}/api/mla-budget/save`, payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        });

        await Promise.all(mlaPromises);
        await fetchMLABudgets(selectedFetchFinancialYear || undefined);
        
        toast({
          title: "Success",
          description: `Budget allocated to ${form.selectedMLAs.length} MLA(s) successfully`,
          variant: "default"
        });
      } else if (selectedPlanType === 'MLC') {
        // Submit MLC budgets
        const mlcPromises = form.selectedMLCs.map(mlcId => {
          const payload = {
            financialYearId: form.financialYearId,
            mlcId,
            schemeId: form.schemeId,
            allocatedLimit,
            remarks: form.remarks
          };
          
          return axios.post(`${baseURL}/api/mlc-budget/saveMLCBudget`, payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        });

        await Promise.all(mlcPromises);
        await fetchMLCBudgets(selectedFetchFinancialYear || undefined);
        
        toast({
          title: "Success",
          description: `Budget allocated to ${form.selectedMLCs.length} MLC(s) successfully`,
          variant: "default"
        });
      } else if (selectedPlanType === 'HADP') {
        // Submit HADP budget
        const payload = {
          schemeId: form.schemeId,
          districtId: form.districtId,
          talukaId: form.talukaId,
          financialYearId: form.financialYearId,
          allocatedLimit,
          remarks: form.remarks
        };
        
        await axios.post(`${baseURL}/api/hadp-budget/allocate`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        await fetchHADPBudgets();
        
        toast({
          title: "Success",
          description: "HADP budget allocated successfully",
          variant: "default"
        });
      }

      // Reset form
      setForm({
        financialYearId: null,
        districtId: null,
        constituencyId: null,
        talukaId: null,
        schemeId: null,
        selectedMLAs: [],
        selectedMLCs: [],
        allocatedLimit: "",
        remarks: "",
        mlaSelectionMode: 'direct'
      });
      setConstituencies([]);
      setTalukas([]);
      
      // Close popup
      setShowAddBudgetPopup(false);

    } catch (err: any) {
      console.error('Error allocating budget:', err);
      const errorMessage = err.response?.data?.message || "Failed to allocate budget";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered data
  const filteredMLAs = useMemo(() => {
    let filtered = mlas;
    
    if (filterDistrict !== 'All') {
      filtered = filtered.filter(mla => mla.districtName === filterDistrict);
    }
    
    return filtered;
  }, [mlas, filterDistrict]);

  const filteredMLCs = useMemo(() => {
    let filtered = mlcs;
    
    if (filterDistrict !== 'All') {
      filtered = filtered.filter(mlc => mlc.region === filterDistrict);
    }
    
    return filtered;
  }, [mlcs, filterDistrict]);

  const filteredMLABudgets = useMemo(() => {
    let filtered = mlaBudgets;
    
    if (filterFinancialYear !== 'All') {
      filtered = filtered.filter(budget => budget.financialYear === filterFinancialYear);
    }
    
    if (filterDistrict !== 'All') {
      filtered = filtered.filter(budget => budget.districtName === filterDistrict);
    }
    
    return filtered;
  }, [mlaBudgets, filterFinancialYear, filterDistrict]);

  const filteredMLCBudgets = useMemo(() => {
    let filtered = mlcBudgets;
    
    if (filterFinancialYear !== 'All') {
      filtered = filtered.filter(budget => budget.financialYear === filterFinancialYear);
    }
    
    if (filterDistrict !== 'All') {
      filtered = filtered.filter(budget => budget.districtName === filterDistrict);
    }
    
    return filtered;
  }, [mlcBudgets, filterFinancialYear, filterDistrict]);

  const filteredHADPBudgets = useMemo(() => {
    let filtered = hadpBudgets;
    
    if (filterFinancialYear !== 'All') {
      filtered = filtered.filter(budget => budget.financialYear === filterFinancialYear);
    }
    
    if (filterDistrict !== 'All') {
      filtered = filtered.filter(budget => budget.districtName === filterDistrict);
    }
    
    return filtered;
  }, [hadpBudgets, filterFinancialYear, filterDistrict]);

  // Get unique financial years and districts for filters
  const availableFinancialYears = useMemo(() => {
    const allYears = [
      ...mlaBudgets.map(b => b.financialYear),
      ...mlcBudgets.map(b => b.financialYear),
      ...hadpBudgets.map(b => b.financialYear)
    ];
    return ['All', ...Array.from(new Set(allYears)).sort()];
  }, [mlaBudgets, mlcBudgets, hadpBudgets]);

  const availableDistricts = useMemo(() => {
    const allDistricts = [
      ...mlaBudgets.map(b => b.districtName),
      ...mlcBudgets.map(b => b.districtName),
      ...hadpBudgets.map(b => b.districtName)
    ];
    return ['All', ...Array.from(new Set(allDistricts)).sort()];
  }, [mlaBudgets, mlcBudgets, hadpBudgets]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFinancialYears(),
        fetchDistricts(),
        fetchSchemes(),
        fetchMLCs(),
        fetchHADPBudgets()
      ]);
      setLoading(false);
    };
    initializeData();
  }, []);

  // Fetch budgets when financial year is selected
  const handleFetchBudgets = async () => {
    if (!selectedFetchFinancialYear) {
      toast({
        title: "Validation Error",
        description: "Please select a financial year to fetch budgets",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await Promise.all([
        fetchMLABudgets(selectedFetchFinancialYear),
        fetchMLCBudgets(selectedFetchFinancialYear)
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">Loading budget allocation data...</span>
            </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
          <h1 className="text-2xl font-bold">Budget Allocation</h1>
          <p className="text-gray-600">Allocate budgets to MLAs, MLCs, and HADP</p>
                </div>
        <Button 
          variant="outline" 
          onClick={async () => {
            setLoading(true);
            await Promise.all([
              fetchFinancialYears(),
              fetchDistricts(),
              fetchSchemes(),
              fetchMLCs(),
              fetchHADPBudgets()
            ]);
            if (selectedFetchFinancialYear) {
              await Promise.all([
                fetchMLABudgets(selectedFetchFinancialYear),
                fetchMLCBudgets(selectedFetchFinancialYear)
              ]);
            }
            setLoading(false);
          }}
          className="flex items-center px-4 py-2 rounded-sm shadow"
        >
          <RefreshCw className="mr-2 h-4 w-4"/> Refresh All
        </Button>
                </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
              <p className="text-sm font-medium text-gray-600">Total Allocations</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredMLABudgets.length + filteredMLCBudgets.length + filteredHADPBudgets.length}
              </p>
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
              <p className="text-sm font-medium text-gray-600">MLA Allocations</p>
              <p className="text-2xl font-bold text-green-600">{filteredMLABudgets.length}</p>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserX className="w-5 h-5 text-purple-600" />
                </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">MLC Allocations</p>
              <p className="text-2xl font-bold text-purple-600">{filteredMLCBudgets.length}</p>
                </div>
          </div>
        </motion.div>
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">HADP Allocations</p>
              <p className="text-2xl font-bold text-orange-600">{filteredHADPBudgets.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Plan Type Selection */}
      <Card className="border border-gray-200 rounded-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Select Plan Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={selectedPlanType === 'MLA' ? 'default' : 'outline'}
              onClick={() => setSelectedPlanType('MLA')}
              className="w-full"
            >
              MLA Budget Allocation
            </Button>
            <Button
              variant={selectedPlanType === 'MLC' ? 'default' : 'outline'}
              onClick={() => setSelectedPlanType('MLC')}
              className="w-full"
            >
              MLC Budget Allocation
            </Button>
            <Button
              variant={selectedPlanType === 'HADP' ? 'default' : 'outline'}
              onClick={() => setSelectedPlanType('HADP')}
              className="w-full"
            >
              HADP Budget Allocation
            </Button>
            </div>
        </CardContent>
      </Card>

      

      {/* Add Budget Button */}
      <Card className="border border-gray-200 rounded-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Budget Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Add new budget allocations for the selected plan type</p>
            <Button 
              onClick={() => setShowAddBudgetPopup(true)}
              className="px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Budget
            </Button>
                </div>
        </CardContent>
      </Card>
          

      {/* Filters */}
      <Card className="border border-gray-200 rounded-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Filter Budget Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Financial Year</Label>
              <Select value={filterFinancialYear} onValueChange={setFilterFinancialYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFinancialYears.map(fy => (
                    <SelectItem key={fy} value={fy}>
                      {fy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                </div>
            <div>
              <Label>District</Label>
              <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Budget Data Table */}
      <Card className="border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Budget Allocation History</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
              <TableHeader>
                <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Financial Year</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Constituency/Taluka</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Allocated Limit</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filteredMLABudgets.map((budget) => (
                <TableRow key={`mla-${budget.id}`}>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">MLA</Badge>
                      </TableCell>
                  <TableCell className="font-medium">{budget.mlaName}</TableCell>
                  <TableCell>{budget.financialYear}</TableCell>
                  <TableCell>{budget.districtName}</TableCell>
                  <TableCell>{budget.constituencyName}</TableCell>
                  <TableCell>{budget.schemeName}</TableCell>
                  <TableCell>₹{budget.allocatedLimit.toLocaleString()}</TableCell>
                  <TableCell>{budget.remarks || '-'}</TableCell>
                  <TableCell>
                    <Badge className={budget.status === 'ACTIVE' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {budget.status}
                    </Badge>
                  </TableCell>
                                    <TableCell>{new Date(budget.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBudget(budget, 'MLA')}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                      </TableCell>
                    </TableRow>
              ))}
              {filteredMLCBudgets.map((budget) => (
                <TableRow key={`mlc-${budget.id}`}>
                  <TableCell>
                    <Badge className="bg-purple-100 text-purple-800">MLC</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{budget.mlcName}</TableCell>
                  <TableCell>{budget.financialYear}</TableCell>
                  <TableCell>{budget.districtName}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{budget.schemeName}</TableCell>
                  <TableCell>₹{budget.allocatedLimit.toLocaleString()}</TableCell>
                  <TableCell>{budget.remarks || '-'}</TableCell>
                  <TableCell>
                    <Badge className={budget.status === 'ACTIVE' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(budget.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBudget(budget, 'MLC')}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                      </TableCell>
                    </TableRow>
              ))}
              {filteredHADPBudgets.map((budget) => (
                <TableRow key={`hadp-${budget.id}`}>
                  <TableCell>
                    <Badge className="bg-orange-100 text-orange-800">HADP</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{budget.talukaName}</TableCell>
                  <TableCell>{budget.financialYear}</TableCell>
                  <TableCell>{budget.districtName}</TableCell>
                  <TableCell>{budget.talukaName}</TableCell>
                  <TableCell>{budget.schemeName}</TableCell>
                  <TableCell>₹{budget.allocatedLimit.toLocaleString()}</TableCell>
                  <TableCell>{budget.remarks || '-'}</TableCell>
                  <TableCell>
                    <Badge className={budget.status === 'ACTIVE' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(budget.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBudget(budget, 'HADP')}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
                            {filteredMLABudgets.length === 0 && filteredMLCBudgets.length === 0 && filteredHADPBudgets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Users className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No budget allocations found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* MLA Budget Edit Popup */}
      <Dialog open={showMLAPopup} onOpenChange={setShowMLAPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit MLA Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>MLA Name</Label>
              <Input value={selectedBudgetForEdit?.mlaName || ''} disabled />
            </div>
            <div>
              <Label>Financial Year</Label>
              <Input value={selectedBudgetForEdit?.financialYear || ''} disabled />
            </div>
            <div>
              <Label>District</Label>
              <Input value={selectedBudgetForEdit?.districtName || ''} disabled />
            </div>
            <div>
              <Label>Constituency</Label>
              <Input value={selectedBudgetForEdit?.constituencyName || ''} disabled />
            </div>
            <div>
              <Label htmlFor="allocatedLimit">Allocated Limit (₹) *</Label>
              <Input
                id="allocatedLimit"
                type="number"
                value={form.allocatedLimit}
                onChange={(e) => setForm(prev => ({ ...prev, allocatedLimit: e.target.value }))}
                placeholder="Enter new allocated limit"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMLAPopup(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateBudget('MLA')}
                disabled={submitting}
              >
                {submitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Budget
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MLC Budget Edit Popup */}
      <Dialog open={showMLCPopup} onOpenChange={setShowMLCPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit MLC Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>MLC Name</Label>
              <Input value={selectedBudgetForEdit?.mlcName || ''} disabled />
            </div>
            <div>
              <Label>Financial Year</Label>
              <Input value={selectedBudgetForEdit?.financialYear || ''} disabled />
            </div>
            <div>
              <Label>District</Label>
              <Input value={selectedBudgetForEdit?.districtName || ''} disabled />
            </div>
            <div>
              <Label htmlFor="allocatedLimit">Allocated Limit (₹) *</Label>
              <Input
                id="allocatedLimit"
                type="number"
                value={form.allocatedLimit}
                onChange={(e) => setForm(prev => ({ ...prev, allocatedLimit: e.target.value }))}
                placeholder="Enter new allocated limit"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMLCPopup(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateBudget('MLC')}
                disabled={submitting}
              >
                {submitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Budget
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* HADP Budget Edit Popup */}
      <Dialog open={showHADPPopup} onOpenChange={setShowHADPPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit HADP Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Taluka Name</Label>
              <Input value={selectedBudgetForEdit?.talukaName || ''} disabled />
            </div>
            <div>
              <Label>Financial Year</Label>
              <Input value={selectedBudgetForEdit?.financialYear || ''} disabled />
            </div>
            <div>
              <Label>District</Label>
              <Input value={selectedBudgetForEdit?.districtName || ''} disabled />
            </div>
            <div>
              <Label htmlFor="allocatedLimit">Allocated Limit (₹) *</Label>
              <Input
                id="allocatedLimit"
                type="number"
                value={form.allocatedLimit}
                onChange={(e) => setForm(prev => ({ ...prev, allocatedLimit: e.target.value }))}
                placeholder="Enter new allocated limit"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowHADPPopup(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleUpdateBudget('HADP')}
                disabled={submitting}
              >
                {submitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Budget
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Budget Popup */}
      <Dialog open={showAddBudgetPopup} onOpenChange={setShowAddBudgetPopup}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Budget Allocation - {selectedPlanType}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Financial Year */}
              <div>
                <Label htmlFor="financialYear">Financial Year *</Label>
                <Select
                  value={form.financialYearId?.toString() || ''}
                  onValueChange={(value) => setForm(prev => ({ ...prev, financialYearId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select financial year" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialYears && financialYears.length > 0 ? financialYears.map(fy => (
                      fy && fy.id ? (
                        <SelectItem key={fy.id} value={fy.id.toString()}>
                          {fy.name}
                        </SelectItem>
                      ) : null
                    )).filter(Boolean) : (
                      <SelectItem value="no-data" disabled>No financial years available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div>
                <Label htmlFor="district">District *</Label>
                <Select
                  value={form.districtId?.toString() || ''}
                  onValueChange={handleDistrictChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts && districts.length > 0 ? districts.map(district => (
                      district && district.id ? (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.name}
                        </SelectItem>
                      ) : null
                    )).filter(Boolean) : (
                      <SelectItem value="no-data" disabled>No districts available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* MLA Selection Mode (only for MLA) */}
              {selectedPlanType === 'MLA' && (
                <div>
                  <Label htmlFor="mlaSelectionMode">MLA Selection Mode *</Label>
                  <Select
                    value={form.mlaSelectionMode}
                    onValueChange={(value: 'direct' | 'constituency') => setForm(prev => ({ 
                      ...prev, 
                      mlaSelectionMode: value,
                      constituencyId: value === 'direct' ? null : prev.constituencyId,
                      selectedMLAs: []
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select MLA selection mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct MLA Selection</SelectItem>
                      <SelectItem value="constituency">Select by Constituency</SelectItem>
                    </SelectContent>
                  </Select>
                        </div>
              )}

              {/* Constituency (only for MLA with constituency mode) */}
              {selectedPlanType === 'MLA' && form.mlaSelectionMode === 'constituency' && (
                <div>
                  <Label htmlFor="constituency">Constituency *</Label>
                  <Select
                    value={form.constituencyId?.toString() || ''}
                    onValueChange={(value) => setForm(prev => ({ 
                      ...prev, 
                      constituencyId: parseInt(value),
                      selectedMLAs: []
                    }))}
                    disabled={!form.districtId || loadingConstituencies}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingConstituencies ? "Loading..." : "Select constituency"} />
                    </SelectTrigger>
                    <SelectContent>
                      {constituencies && constituencies.length > 0 ? constituencies.map(constituency => (
                        constituency && constituency.id ? (
                          <SelectItem key={constituency.id} value={constituency.id.toString()}>
                            {constituency.name}
                          </SelectItem>
                        ) : null
                      )).filter(Boolean) : (
                        <SelectItem value="no-data" disabled>No constituencies available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Taluka (only for HADP) */}
              {selectedPlanType === 'HADP' && (
                <div>
                  <Label htmlFor="taluka">Taluka *</Label>
                  <Select
                    value={form.talukaId?.toString() || ''}
                    onValueChange={(value) => setForm(prev => ({ ...prev, talukaId: parseInt(value) }))}
                    disabled={!form.districtId || loadingTalukas}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingTalukas ? "Loading..." : "Select taluka"} />
                    </SelectTrigger>
                    <SelectContent>
                      {talukas && talukas.length > 0 ? talukas.map(taluka => (
                        taluka && taluka.id ? (
                          <SelectItem key={taluka.id} value={taluka.id.toString()}>
                            {taluka.name}
                          </SelectItem>
                        ) : null
                      )).filter(Boolean) : (
                        <SelectItem value="no-data" disabled>No talukas available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Scheme */}
              <div>
                <Label htmlFor="scheme">Scheme *</Label>
                <Select
                  value={form.schemeId?.toString() || ''}
                  onValueChange={(value) => setForm(prev => ({ ...prev, schemeId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemes && schemes.length > 0 ? schemes.map((scheme, index) => {
                      if (typeof scheme === 'string') {
                        return (
                          <SelectItem key={index} value={index.toString()}>
                            {scheme}
                          </SelectItem>
                        );
                      } else if (scheme && (scheme.id || scheme.name || scheme.schemeName)) {
                        return (
                          <SelectItem key={scheme.id || index} value={scheme.id?.toString() || index.toString()}>
                            {scheme.schemeName || scheme.name}
                          </SelectItem>
                        );
                      }
                      return null;
                    }).filter(Boolean) : (
                      <SelectItem value="no-data" disabled>No schemes available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Allocated Limit */}
              <div>
                <Label htmlFor="allocatedLimit">Allocated Limit (₹) *</Label>
                <Input
                  id="allocatedLimit"
                  type="number"
                  value={form.allocatedLimit}
                  onChange={(e) => setForm(prev => ({ ...prev, allocatedLimit: e.target.value }))}
                  placeholder="Enter allocated limit"
                />
              </div>
            </div>

            {/* MLA/MLC Selection (not for HADP) */}
            {selectedPlanType !== 'HADP' && (
              <div>
                <Label className="text-base font-medium">
                  Select {selectedPlanType === 'MLA' ? 'MLAs' : 'MLCs'} *
                </Label>
                <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
                  {selectedPlanType === 'MLA' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {mlas
                        .filter(mla => {
                          if (form.mlaSelectionMode === 'constituency' && form.constituencyId) {
                            // Filter MLAs by selected constituency
                            return mla.constituencyId === form.constituencyId;
                          }
                          return true; // Show all MLAs for direct selection
                        })
                        .map(mla => (
                        <div key={mla.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mla-${mla.id}`}
                            checked={form.selectedMLAs.includes(mla.id)}
                            onCheckedChange={(checked) => handleMLASelection(mla.id, checked as boolean)}
                          />
                          <Label htmlFor={`mla-${mla.id}`} className="text-sm cursor-pointer">
                            <div className="font-medium">{mla.mlaName}</div>
                            <div className="text-xs text-gray-500">
                              {mla.constituencyName} • {mla.party}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {filteredMLCs.map(mlc => (
                        <div key={mlc.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mlc-${mlc.id}`}
                            checked={form.selectedMLCs.includes(mlc.id)}
                            onCheckedChange={(checked) => handleMLCSelection(mlc.id, checked as boolean)}
                          />
                          <Label htmlFor={`mlc-${mlc.id}`} className="text-sm cursor-pointer">
                            <div className="font-medium">{mlc.mlcName}</div>
                            <div className="text-xs text-gray-500">
                              {mlc.category} • {mlc.region}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                        </div>
              </div>
            )}

            {/* Remarks */}
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={form.remarks}
                onChange={(e) => setForm(prev => ({ ...prev, remarks: e.target.value }))}
                placeholder="Enter remarks (optional)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddBudgetPopup(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Allocating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Allocate Budget
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetAllocation;
