// src/components/WorkVendorManagement.tsx

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, CheckCircle, Loader2, X, UploadCloud, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// TypeScript interfaces
interface Work {
  id: number;
  name: string;
  financialYear: string;
  adminApprovedAmount: number;
  workPortionAmount?: number;
  workLimit?: number;
  schemeId?: number;
  status: string;
  assignedVendor?: Vendor;
  assignedTax?: Tax[];
  grossTotal?: number;
  workOrderFile?: File;
}

interface Vendor {
  id: number;
  name: string;
  aadhaarNumber?: string;
  gstNumber?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
}

interface Tax {
  taxName: string;
  taxPercentage: number;
  taxAmount?: number;
}

interface AssignVendorModalProps {
  open: boolean;
  onClose: () => void;
  work: Work | null;
  onAssign: (data: any) => void;
  vendors: Vendor[];
  taxes: Tax[];
}

interface WorkVendorManagementProps {}

function getStatusBadge(status: string) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
      ${
        status === "Completed"
          ? "bg-green-100 text-green-700"
          : status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

// Assign Vendor Modal
const AssignVendorModal: React.FC<AssignVendorModalProps> = ({
  open,
  onClose,
  work,
  onAssign,
  vendors,
  taxes,
}) => {
  const { toast } = useToast();
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [selectedTaxNames, setSelectedTaxNames] = useState<string[]>([]);
  const [portionAmount, setPortionAmount] = useState<number>(work?.workPortionAmount ?? 0);
  const [isAssigning, setIsAssigning] = useState(false);
  const [workOrderFile, setWorkOrderFile] = useState<File | null>(null);

  useEffect(() => {
    if (work) {
      setPortionAmount(work.workPortionAmount ?? 0);
      setSelectedVendorId("");
      setSelectedTaxNames([]);
      setWorkOrderFile(null);
    }
  }, [work, open]);

  if (!open || !work) return null;

  // Tax objects
  const selectedTaxObjs = taxes.filter((t: Tax) => selectedTaxNames.includes(t.taxName));
  const dedAmount = selectedTaxObjs.reduce(
    (sum: number, t: Tax) => sum + ((portionAmount * t.taxPercentage) / 100),
    0
  );
  const grossTotal = portionAmount + dedAmount;

  const vendor = vendors.find((v: Vendor) => v.id === Number(selectedVendorId));
  const canAssign = vendor && portionAmount > 0 && grossTotal <= (work.workLimit ?? work.adminApprovedAmount);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setWorkOrderFile(e.target.files[0]);
  };

  const handleAssign = async () => {
    if (!canAssign) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);
    try {
      // Send API request to assign vendor
      await axios.post(
        `${BASE_URL}/api/work-vendor-mapping/assign-vendor`,
        {
          workId: work.id,
          vendorId: Number(selectedVendorId),
          workPortionAmount: portionAmount,
          taxes: selectedTaxObjs.map((t: Tax) => ({
            taxName: t.taxName,
            taxPercentage: t.taxPercentage,
            taxAmount: (portionAmount * t.taxPercentage) / 100,
          })),
        },
        {
          headers: { Authorization: localStorage.getItem("token") || "" },
        }
      );
      
      onAssign({
        assignedVendor: vendor,
        assignedTax: selectedTaxObjs,
        workPortionAmount: portionAmount,
        grossTotal,
        status: "Completed",
        workOrderFile, // just for frontend display
      });
      
      toast({
        title: "Success",
        description: "Vendor assigned successfully",
        variant: "default"
      });
      
      setIsAssigning(false);
      onClose();
    } catch (err: any) {
      console.error('Error assigning vendor:', err);
      const errorMessage = err.response?.data?.message || "Failed to assign vendor. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[70vw] max-w-4xl p-8 relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-primary">Assign Vendor to Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-5 rounded-lg mb-5">
          <div>
            <span className="font-semibold text-gray-700">Work Title</span>
            <div>{work.name}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Financial Year</span>
            <div>{work.financialYear}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Admin Approved Limit</span>
            <div>₹{(work.adminApprovedAmount ?? 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Select Vendor <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
            >
              <option value="">-- Select Vendor --</option>
              {vendors.map((v: Vendor) => (
                <option key={v.id} value={v.id}>
                  {v.name} (**** **** {v.aadhaarNumber?.slice(-4) || "----"})
                </option>
              ))}
            </select>
            {vendor && (
              <div className="mt-3 border rounded-lg bg-gray-50 p-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Account:</span>
                    <span className="font-mono text-gray-800">{vendor.bankAccountNumber ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">IFSC:</span>
                    <span className="font-mono text-gray-800">{vendor.bankIfsc ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <CheckCircle className="inline w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">Verified</span>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="font-medium text-gray-700">GST:</span> {vendor.gstNumber}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Aadhaar:</span>{" "}
                  **** **** {vendor.aadhaarNumber?.slice(-4) || "----"}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Work Portion Amount (Work Order Amount) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={portionAmount}
              min={1}
              max={work.adminApprovedAmount}
              onChange={(e) => setPortionAmount(Number(e.target.value))}
            />
            {portionAmount > work.adminApprovedAmount && (
              <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Portion amount cannot exceed Admin Approved Amount.
              </div>
            )}
            <label className="font-semibold text-gray-700 block mb-1 mt-4">
              Tax/Deductions (select one or more)
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              multiple
              value={selectedTaxNames}
              onChange={e =>
                setSelectedTaxNames(Array.from(e.target.selectedOptions, option => option.value))
              }
              size={Math.min(4, taxes.length)}
            >
              {taxes.map((tax: Tax) => (
                <option key={tax.taxName} value={tax.taxName}>
                  {tax.taxName} ({tax.taxPercentage}%)
                </option>
              ))}
            </select>
            <div className="mt-4">
              <label className="font-semibold text-gray-700 block mb-1">
                Work Order Letter (PDF, Image)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="text-sm">
                  {workOrderFile ? workOrderFile.name : "Select file"}
                </span>
              </label>
              {workOrderFile && (
                <div className="mt-2 text-xs text-green-700">File attached (Not uploaded to backend)</div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 bg-gray-50 p-3 rounded-xl text-sm">
          <div>
            <span className="font-semibold text-gray-600">Deducted Amount:</span>
            <div>₹{dedAmount.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Gross Total:</span>
            <div>₹{grossTotal.toLocaleString()}</div>
          </div>
        </div>
        {grossTotal > (work.adminApprovedAmount ?? 0) && (
          <div className="text-red-500 text-xs mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Gross amount cannot exceed Admin Approved Amount!
          </div>
        )}
        <Button
          className="w-full mt-2"
          disabled={!canAssign || isAssigning}
          onClick={handleAssign}
        >
          {isAssigning ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Assign Vendor
        </Button>
      </div>
    </div>
  );
};

// Main Component
const WorkVendorManagement: React.FC<WorkVendorManagementProps> = () => {
  const { toast } = useToast();
  const [works, setWorks] = useState<Work[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [activeModal, setActiveModal] = useState({ open: false, work: null as Work | null });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterFy, setFilterFy] = useState("");
  const [filterScheme, setFilterScheme] = useState("");
  const [filterWork, setFilterWork] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [worksRes, vendorsRes, taxesRes, countsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/work-vendor-mapping/works`, {
            headers: { Authorization: localStorage.getItem("token") || "" }
          }),
          axios.get(`${BASE_URL}/api/work-vendor-mapping/vendors`, {
            headers: { Authorization: localStorage.getItem("token") || "" }
          }),
          axios.get(`${BASE_URL}/api/tax-master`, {
            headers: { Authorization: localStorage.getItem("token") || "" }
          }),
          axios.get(`${BASE_URL}/api/work-vendor-mapping/counts`, {
            headers: { Authorization: localStorage.getItem("token") || "" }
          })
        ]);

        setWorks(worksRes.data || []);
        setVendors(vendorsRes.data || []);
        setTaxes(taxesRes.data || []);
        setCounts(countsRes.data || {});
      } catch (err: any) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.data?.message || "Failed to fetch data";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filtered works
  const filteredWorks = useMemo(() => {
    let filtered = works;
    if (filterFy)
      filtered = filtered.filter((w: Work) => w.financialYear === filterFy);
    if (filterScheme)
      filtered = filtered.filter((w: Work) => String(w.schemeId) === filterScheme);
    if (filterWork)
      filtered = filtered.filter((w: Work) => w.name === filterWork);
    if (filterStatus)
      filtered = filtered.filter((w: Work) =>
        filterStatus === "Completed"
          ? w.status === "Completed" && w.assignedVendor
          : w.status === "Pending" && !w.assignedVendor
      );
    return filtered;
  }, [works, filterFy, filterScheme, filterWork, filterStatus]);

  // Assign vendor logic (update UI after assigning)
  const handleAssignVendor = (workId: number, data: any) => {
    setWorks(ws =>
      ws.map((w: Work) =>
        w.id === workId
          ? {
              ...w,
              assignedVendor: data.assignedVendor,
              assignedTax: data.assignedTax,
              workPortionAmount: data.workPortionAmount,
              grossTotal: data.grossTotal,
              status: data.status,
              workOrderFile: data.workOrderFile,
            }
          : w
      )
    );
  };

  // FY/Work/Scheme options
  const fyOptions = useMemo(() => [...new Set(works.map((w: Work) => w.financialYear))], [works]);
  const schemeOptions = useMemo(() => {
    const unique = new Set<string>();
    works.forEach((w: Work) => unique.add(String(w.schemeId || '')));
    return Array.from(unique);
  }, [works]);
  const workOptions = useMemo(() => [...new Set(works.map((w: Work) => w.name))], [works]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-600">Loading work vendor data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.totalSchemes ?? 0}</div>
            <p className="text-xs text-muted-foreground">Schemes managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Works Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.totalWorks ?? 0}</div>
            <p className="text-xs text-muted-foreground">Works under schemes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendor Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.totalVendors ?? 0}</div>
            <p className="text-xs text-muted-foreground">Vendors registered to schemes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Work Vendor Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.pendingVendorReg ?? 0}</div>
            <p className="text-xs text-muted-foreground">Works pending vendor assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-end gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <label className="block font-medium mb-1 text-gray-700">Financial Year</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filterFy}
            onChange={e => setFilterFy(e.target.value)}
          >
            <option value="">All</option>
            {fyOptions.map(fy => (
              <option key={fy} value={fy}>
                {fy}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-0">
          <label className="block font-medium mb-1 text-gray-700">Scheme</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filterScheme}
            onChange={e => setFilterScheme(e.target.value)}
          >
            <option value="">All</option>
            {schemeOptions.map(sid => (
              <option key={sid} value={sid}>
                {sid}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-0">
          <label className="block font-medium mb-1 text-gray-700">Work</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filterWork}
            onChange={e => setFilterWork(e.target.value)}
          >
            <option value="">All</option>
            {workOptions.map(w => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-0">
          <label className="block font-medium mb-1 text-gray-700">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending Vendor Registration</option>
            <option value="Completed">Completed Vendor Registration</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Actions (Assign Vendor)
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Scheme ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Work Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Fin. Year
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                AA Amount
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Gross Total
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredWorks.map((w: Work, idx: number) => (
              <tr
                key={w.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-primary/5 transition border-b last:border-0`}
              >
                <td className="px-4 py-2 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveModal({ open: true, work: w })}
                    disabled={!!w.assignedVendor}
                  >
                    <User className="w-4 h-4 mr-1" />
                    {w.assignedVendor ? "Assigned" : "Assign Vendor"}
                  </Button>
                  {w.assignedVendor && (
                    <span className="block mt-1 text-xs text-green-700 font-semibold">
                      Assigned: {w.assignedVendor.name}
                    </span>
                  )}
                  {w.workOrderFile && (
                    <div className="mt-1 text-xs text-blue-500">
                      📄 {w.workOrderFile.name}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{w.schemeId ?? "-"}</td>
                <td className="px-4 py-2">{w.name}</td>
                <td className="px-4 py-2">{w.financialYear}</td>
                <td className="px-4 py-2 text-right">
                  ₹{(w.adminApprovedAmount ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  ₹{(w.grossTotal ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">
                  {getStatusBadge(w.status)}
                </td>
              </tr>
            ))}
            {filteredWorks.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">
                  No works found for selected filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign Vendor Modal */}
      <AssignVendorModal
        open={activeModal.open}
        onClose={() => setActiveModal({ open: false, work: null })}
        work={activeModal.work}
        onAssign={(data: any) => handleAssignVendor(activeModal.work?.id || 0, data)}
        vendors={vendors}
        taxes={taxes}
      />
    </div>
  );
};

export default WorkVendorManagement;
