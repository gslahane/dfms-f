import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, CheckCircle, Loader2, X } from "lucide-react";

// Dummy Data
const SCHEMES = [
  { id: 1, name: '45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME (15) Ajit Pawar' },
];
const WORKS = [

  {
    id: 1,
    schemeId: 1,
    name: 'ML/2425/2564 आमदार स्थानिक विकास कार्यक्रम सन 2024-25 अंतर्गत बारामती येथे होणाऱ्या शिवछत्रपती राज्य स्तरीय कबड्डी स्पर्धेकरिता निधी उपलब्ध करणेबाबत',
    sanctionedDate: '2024-02-27',
    financialYear: '2024-25',
    adminApprovedAmount: 1558000,
    workPortionAmount: '1299990',
    taxDeductionAmount: '100010',
    workLimit: 2500000,
    status: 'Pending',
    assignedVendor: null,
    assignedTax: [],
    dedAmount: 0,
    grossTotal: 1400000,
    balanceAmount: '',
  },
  {
    id: 4,
    schemeId: 1,
    name: 'जाधववाडी देव मंदिर मागे रांजणी रस्ता सुधारणा (ग्रा.पा. जाधववाडी)',
    sanctionedDate: '2024-02-27',
    financialYear: '2024-25',
    adminApprovedAmount: 1600000,
    workPortionAmount: 1400000,
    taxDeductionAmount: 150000,
    workLimit: 2499999,
    status: 'Pending',
    assignedVendor: null,
    assignedTax: [],
    dedAmount: 0,
    grossTotal: 1550000,
    balanceAmount: 2499999,
  },
  {
    id: 5,
    schemeId: 1,
    name: 'खडक ते जोगिवहीर फाटा रस्ता सुधारणा (ग्रा.पा. खडक)',
    sanctionedDate: '2024-02-27',
    financialYear: '2024-25',
    adminApprovedAmount: 1223000,
    workPortionAmount: 1023000,
    taxDeductionAmount: 100000,
    workLimit: 1999993,
    status: 'Pending',
    assignedVendor: null,
    assignedTax: [],
    dedAmount: 0,
    grossTotal: 1223000,
    balanceAmount: 0,
  },
  {
    id: 6,
    schemeId: 1,
    name: 'तोरणे ते आढे बु||, रस्ता सुधारणा (खेड तालुका)',
    sanctionedDate: '2024-02-28',
    financialYear: '2024-25',
    adminApprovedAmount: 2839000,
    workPortionAmount: 2839000,
    taxDeductionAmount: 0,
    workLimit: 3000000,
    status: 'Pending',
    assignedVendor: null,
    assignedTax: [],
    dedAmount: 0,
    grossTotal: 0,
    balanceAmount: 3000000,
  },
  {
    id: 7,
    schemeId: 1,
    name: 'इंजमा ५२ चबळी माजगाव येथील रस्ता',
    sanctionedDate: '2024-02-28',
    financialYear: '2024-25',
    adminApprovedAmount: 3188000,
    workPortionAmount: 3188000,
    taxDeductionAmount: 0,
    workLimit: 3999459,
    status: 'Pending',
    assignedVendor: null,
    assignedTax: [],
    dedAmount: 0,
    grossTotal: 0,
    balanceAmount: 3999459,
  },
  {
    id: 8,
    schemeId: 1,
    name: 'कवळे कडव ती रस्ता (मागणी क्र. १९२)',
    sanctionedDate: '2024-03-13',
    financialYear: '2024-25',
    adminApprovedAmount: 1440000,
    workPortionAmount: 1440000,
    taxDeductionAmount: 0,
    workLimit: 1799826,
    status: 'Pending',
    assignedVendor: null,
    assignedTax: [],
    dedAmount: 0,
    grossTotal: 0,
    balanceAmount: 1799826,
  },
  {
    id: 9,
    schemeId: 1,
    name: 'कवळे हसेव ती रस्ता (मागणी क्र. १९१)',
    sanctionedDate: '2024-03-11',
    financialYear: '2024-25',
    adminApprovedAmount: 1322000,
    workPortionAmount: 1322000,
    taxDeductionAmount: 0,
    workLimit: 1652000,
    status: 'Pending',
    assignedVendor: null,
    assignedTax: [],
    dedAmount: 0,
    grossTotal: 0,
    balanceAmount: 1652000,
  },
  // ...add other works as needed using the above structure.
];
const VENDORS = [
  {
    id: 1, name: 'OM Nikas', aadhar: '1234-5678-9012', gst: '27AABCU9603R1ZM',
    account: '111222333444', ifsc: 'ICIC0001112', verified: true
  },
  {
    id: 2, name: 'Sunil Shinde', aadhar: '4567-8910-1121', gst: '22AABCU9603R1ZM',
    account: '222333444555', ifsc: 'SBIN0001234', verified: true
  },
];
const TAX_OPTIONS = [
  { name: 'GST (18%)', value: 0.18 },
  { name: 'S. Cess (9%)', value: 0.09 },
  { name: 'TDS (2%)', value: 0.02 }
];

const getFyList = () => [...new Set(WORKS.map((w) => w.financialYear))];
const getStatusBadge = (status) => (
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

// Assign Vendor Modal
const AssignVendorModal = ({ open, onClose, work, onAssign, vendors }) => {
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [selectedTax, setSelectedTax] = useState(""); // dropdown (single)
  const [portionAmount, setPortionAmount] = useState(
    work?.workPortionAmount ?? 0
  );
  const [isAssigning, setIsAssigning] = useState(false);

  if (!open || !work) return null;

  // Find the selected tax object
  const selectedTaxObj = TAX_OPTIONS.find((t) => t.name === selectedTax);
  const dedAmount = selectedTaxObj ? portionAmount * selectedTaxObj.value : 0;
  const grossTotal = portionAmount + dedAmount;

  const vendor = vendors.find((v) => v.id === Number(selectedVendorId));

  const canAssign =
    vendor && portionAmount > 0 && grossTotal <= (work.workLimit ?? 0);

  const handleAssign = () => {
    setIsAssigning(true);
    setTimeout(() => {
      onAssign({
        assignedVendor: vendor,
        assignedTax: selectedTaxObj ? [selectedTaxObj] : [],
        portionAmount,

        dedAmount,
        grossTotal,
        status: "Completed",
      });
      setIsAssigning(false);
      onClose();
      setSelectedVendorId("");
      setSelectedTax("");
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[70vw] max-w-4xl p-8 relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-primary">
          Assign Vendor to Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-5 rounded-lg mb-5">
          <div>
            <span className="font-semibold text-gray-700">MLA/MLC Name</span>
            <div>{SCHEMES.find((s) => s.id === work.schemeId)?.name}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Work Title</span>
            <div>{work.name}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Fin. Year</span>
            <div>{work.financialYear}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Sanctioned Date</span>
            <div>{work.sanctionedDate}</div>
          </div>
          {/* <div>
            <span className="font-semibold text-gray-700">Work Portion Amount</span>
            <div>₹{(work.workPortionAmount ?? 0).toLocaleString()}</div>
          </div> */}
          <div>
            <span className="font-semibold text-gray-700">
              Admin Approved Limit
            </span>
            <div>₹{(work.adminApprovedAmount ?? 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Select Vendor
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
            >
              <option value="">-- Select Vendor --</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (**** **** {v.aadhar?.slice(-4) || "----"})
                </option>
              ))}
            </select>

            {vendor && (
              <div className="mt-3 border rounded-lg bg-gray-50 p-3">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Account:</span>
                    <span className="font-mono text-gray-800">
                      {vendor.account ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">IFSC:</span>
                    <span className="font-mono text-gray-800">
                      {vendor.ifsc ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <CheckCircle className="inline w-4 h-4 text-green-600" />
                    <span className="text-green-700 font-medium">Verified</span>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="font-medium text-gray-700">GST:</span>{" "}
                  {vendor.gst}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Aadhar:</span>{" "}
                  **** **** {vendor.aadhar?.slice(-4) || "----"}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              Work Portion Amount
            </label>
            <Input
              type="number"
              value={portionAmount}
              min={1}
              max={work.workLimit}
              onChange={(e) => setPortionAmount(Number(e.target.value))}
            />
            {portionAmount > work.adminApprovedAmount && (
              <div className="text-red-500 text-xs mt-1">
                Portion amount cannot exceed Admin ApprovedAmount.
              </div>
            )}
            <label className="font-semibold text-gray-700 block mb-1 mt-4">
              Tax/Deductions
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedTax}
              onChange={(e) => setSelectedTax(e.target.value)}
            >
              <option value="">-- Select Tax --</option>
              {TAX_OPTIONS.map((tax) => (
                <option key={tax.name} value={tax.name}>
                  {tax.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 bg-gray-50 p-3 rounded-xl text-sm">
          <div>
            <span className="font-semibold text-gray-600">
              Deducted Amount:
            </span>
            <div>₹{dedAmount.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Gross Total:</span>
            <div>₹{grossTotal.toLocaleString()}</div>
          </div>
        </div>
        {/* Error if grossTotal > limit */}
        {grossTotal > (work.adminApprovedAmount ?? 0) && (
          <div className="text-red-500 text-xs mb-2">
            Gross amount cannot exceed adminApprovedAmount!
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
const WorkVendorManagement = () => {
  const [works, setWorks] = useState(WORKS);
  const [activeModal, setActiveModal] = useState({ open: false, work: null });
  // Filters
  const [filterFy, setFilterFy] = useState("");
  const [filterScheme, setFilterScheme] = useState("");
  const [filterWork, setFilterWork] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Stats
  const stats = {
    totalSchemes: SCHEMES.length,
    totalWorks: works.length,
    totalVendors: works.filter((w) => !!w.assignedVendor).length,
    pendingVendorReg: works.filter((w) => !w.assignedVendor).length,
  };

  // Filtered works
  let filteredWorks = works;
  if (filterFy)
    filteredWorks = filteredWorks.filter((w) => w.financialYear === filterFy);
  if (filterScheme)
    filteredWorks = filteredWorks.filter(
      (w) => w.schemeId === Number(filterScheme)
    );
  if (filterWork)
    filteredWorks = filteredWorks.filter((w) => w.name === filterWork);
  if (filterStatus)
    filteredWorks = filteredWorks.filter((w) =>
      filterStatus === "Completed"
        ? w.status === "Completed" && w.assignedVendor
        : w.status === "Pending" && !w.assignedVendor
    );

  // Assign vendor logic
  const handleAssignVendor = (workId, data) => {
    setWorks((ws) =>
      ws.map((w) =>
        w.id === workId
          ? {
              ...w,
              assignedVendor: data.assignedVendor,
              assignedTax: data.assignedTax,
              workPortionAmount: data.portionAmount,
              taxDeductionAmount: data.dedAmount,
              grossTotal: data.grossTotal,
              balanceAmount: data.balanceAmount,
              status: data.status,
            }
          : w
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchemes}</div>
            <p className="text-xs text-muted-foreground">Schemes managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Works Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorks}</div>
            <p className="text-xs text-muted-foreground">Works under schemes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Vendor Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              Vendors registered to schemes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Work Vendor Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVendorReg}</div>
            <p className="text-xs text-muted-foreground">
              Works pending vendor assignment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
<div className="flex items-end gap-4 mb-6">
  <div className="flex-1 min-w-0">
    <label className="block font-medium mb-1 text-gray-700">
      Financial Year
    </label>
    <select
      className="w-full border rounded px-3 py-2"
      value={filterFy}
      onChange={(e) => setFilterFy(e.target.value)}
    >
      <option value="">All</option>
      {getFyList().map((fy) => (
        <option key={fy} value={fy}>
          {fy}
        </option>
      ))}
    </select>
  </div>

  <div className="flex-1 min-w-0">
    <label className="block font-medium mb-1 text-gray-700">
      Scheme
    </label>
    <select
      className="w-full border rounded px-3 py-2"
      value={filterScheme}
      onChange={(e) => setFilterScheme(e.target.value)}
    >
      <option value="">All</option>
      {SCHEMES.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  </div>

  <div className="flex-1 min-w-0">
    <label className="block font-medium mb-1 text-gray-700">
      Work
    </label>
    <select
      className="w-full border rounded px-3 py-2"
      value={filterWork}
      onChange={(e) => setFilterWork(e.target.value)}
    >
      <option value="">All</option>
      {WORKS.map((w) => (
        <option key={w.id} value={w.name}>
          {w.name}
        </option>
      ))}
    </select>
  </div>

  <div className="flex-1 min-w-0">
    <label className="block font-medium mb-1 text-gray-700">
      Status
    </label>
    <select
      className="w-full border rounded px-3 py-2"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
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
                Scheme
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Work Name
              </th>
              {/* <th className="px-4 py-3 text-left font-semibold text-gray-700">Work Sanctioned Date</th> */}
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Fin. Year
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                AA Amount
              </th>
              {/* <th className="px-4 py-3 text-right font-semibold text-gray-700">Portion Amt</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Tax/Deduction</th> */}
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Gross Total
              </th>
              {/* <th className="px-4 py-3 text-right font-semibold text-gray-700">Work Limit</th> */}
              {/* <th className="px-4 py-3 text-right font-semibold text-gray-700">Balance Amt</th> */}
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredWorks.map((w, idx) => (
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
                </td>
                <td className="px-4 py-2">
                  {SCHEMES.find((s) => s.id === w.schemeId)?.name ?? "-"}
                </td>
                <td className="px-4 py-2">{w.name}</td>
                {/* <td className="px-4 py-2">{w.sanctionedDate}</td> */}
                <td className="px-4 py-2">{w.financialYear}</td>
                <td className="px-4 py-2 text-right">
                  ₹{(w.adminApprovedAmount ?? 0).toLocaleString()}
                </td>
                {/* <td className="px-4 py-2 text-right">₹{(w.workPortionAmount ?? 0).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">
                  {w.assignedTax?.length
                    ? w.assignedTax.map((tax) => (
                      <span key={tax.name} className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-1">{tax.name}</span>
                    ))
                    : '-'}
                </td> */}
                <td className="px-4 py-2 text-right">
                  ₹{(w.grossTotal ?? 0).toLocaleString()}
                </td>
                {/* <td className="px-4 py-2 text-right">₹{(w.workLimit ?? 0).toLocaleString()}</td> */}
                {/* <td className="px-4 py-2 text-right font-semibold text-primary">
                  ₹{(w.balanceAmount ?? 0).toLocaleString()}
                </td> */}
                <td className="px-4 py-2 text-center">
                  {getStatusBadge(w.status)}
                </td>
              </tr>
            ))}
            {filteredWorks.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center text-gray-400 py-6">
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
        onAssign={(data) => handleAssignVendor(activeModal.work.id, data)}
        vendors={VENDORS}
      />
    </div>
  );
};

export default WorkVendorManagement;