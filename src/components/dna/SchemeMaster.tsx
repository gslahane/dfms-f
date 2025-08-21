import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Plus, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface SchemeRow {
  schemeId?: number;
  schemeName: string;
  planType: string;
  allocatedBudget: number;
  estimatedBudget: number;
  revisedBudget: number;
  nextBudget: number;
  districtName: string;
  districtAllocatedLimit: number;
  districtUtilizedLimit: number;
  districtRemainingLimit: number;
  financialYear: string;
  schemeTypeName: string;
}

interface FinancialYear {
  id: number;
  name: string;
}
interface Sector {
  id: number;
  name: string;
}
interface District {
  id: number;
  name: string;
}

type SchemeTypeEnum = "Capital" | "Debt" | "Revenue";
const schemeTypeOptions: SchemeTypeEnum[] = ["Capital", "Debt", "Revenue"];
const planTypeOptions = ["DAP", "MLA", "MLC", "HADP"];

const SchemeMaster: React.FC = () => {
  const { toast } = useToast();

  // States
  const [schemesTable, setSchemesTable] = useState<SchemeRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [allSchemes, setAllSchemes] = useState<SchemeRow[]>([]);

  // Filters
  const [fy, setFy] = useState("");
  const [planType, setPlanType] = useState("");
  const [district, setDistrict] = useState("");
  const [schemeType, setSchemeType] = useState<SchemeTypeEnum | "">("");

  // Add Scheme Modal
  const [openAdd, setOpenAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({
    schemeName: "",
    // schemeCode: "",
    crcCode: "",
    objectCode: "",
    objectName: "",
    majorHeadName: "",
    description: "",
    financialYearId: 0,
    baseSchemeType: "" as SchemeTypeEnum | "",
    sectorId: 0,
    planType: "DAP",
  });

  // Map Scheme to District Modal
  const [openMap, setOpenMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | "">("");
  const [schemeFilter, setSchemeFilter] = useState("");
  const [selectedSchemes, setSelectedSchemes] = useState<number[]>([]);

  // Fetch Data
  useEffect(() => {
    fetchTableData();
    fetchDropdownData();
  }, []);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/scheme-master/fetch`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSchemesTable(data);
        setAllSchemes(data);
      }
    } catch {
      toast({ title: "Failed to fetch schemes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [fyRes, sectorRes, distRes] = await Promise.all([
        fetch(`${API_BASE}/api/dropdown/financial-years`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/dropdown/sectors`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/dropdown/districts`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (fyRes.ok) setFinancialYears(await fyRes.json());
      if (sectorRes.ok) setSectors(await sectorRes.json());
      if (distRes.ok) setDistricts(await distRes.json());
    } catch {
      toast({ title: "Failed to fetch dropdown data", variant: "destructive" });
    }
  };

  // Filters
  const filtered = useMemo(() => {
    return schemesTable.filter((s) => {
      if (fy && s.financialYear !== fy) return false;
      if (planType && s.planType !== planType) return false;
      if (district && s.districtName !== district) return false;
      if (schemeType && s.schemeTypeName !== schemeType) return false;
      return true;
    });
  }, [schemesTable, fy, planType, district, schemeType]);

  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((s) =>
      s.schemeName.toLowerCase().includes(schemeFilter.toLowerCase())
    );
  }, [allSchemes, schemeFilter]);

  const toggleSchemeSelection = (schemeId: number) => {
    setSelectedSchemes((prev) =>
      prev.includes(schemeId)
        ? prev.filter((id) => id !== schemeId)
        : [...prev, schemeId]
    );
  };

  // Input Change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "financialYearId" || name === "sectorId" ? Number(value) : value,
    }));
  };

  // Add Scheme
  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.schemeName ||
      // !form.schemeCode ||
      !form.crcCode ||
      !form.objectCode ||
      !form.objectName ||
      !form.majorHeadName ||
      !form.description ||
      !form.financialYearId ||
      !form.baseSchemeType ||
      !form.sectorId
    ) {
      toast({ title: "All fields are required", variant: "default" });
      return;
    }

    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/scheme-master/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add scheme");

      toast({ title: "✅ Scheme added successfully!", variant: "default" });
      setOpenAdd(false);
      setForm({
        schemeName: "",
        // schemeCode: "",
        crcCode: "",
        objectCode: "",
        objectName: "",
        majorHeadName: "",
        description: "",
        financialYearId: 0,
        baseSchemeType: "",
        sectorId: 0,
        planType: "DAP",
      });
      fetchTableData();
    } catch (err: any) {
      toast({ title: "❌ Error", description: err.message, variant: "destructive" });
    } finally {
      setAddLoading(false);
    }
  };

  // Map Schemes
  const handleMapSchemes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDistrictId || selectedSchemes.length === 0) {
      toast({ title: "⚠ Select a district and at least one scheme", variant: "destructive" });
      return;
    }

    setMapLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { districtId: selectedDistrictId, schemeIds: selectedSchemes };

      const res = await fetch(`${API_BASE}/api/scheme-master/mapWithDistrict`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to map schemes");
      toast({ title: "✅ Schemes mapped successfully!", variant: "default" });

      setOpenMap(false);
      setSelectedDistrictId("");
      setSelectedSchemes([]);
    } catch (err: any) {
      toast({ title: "❌ Error", description: err.message, variant: "destructive" });
    } finally {
      setMapLoading(false);
    }
  };

  return (
    <div className="max-w-12xl mx-auto p-0 space-y-2">
      <Card className="border shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
  <CardTitle className="text-xl font-semibold text-gray-800">
    📋 Scheme Master
  </CardTitle>

  <div className="flex gap-3">
    {/* ✅ Map Scheme to District */}
    <Dialog open={openMap} onOpenChange={setOpenMap}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9 px-4"
        >
          <Send className="w-4 h-4" /> Map Schemes
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Map Schemes to District
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleMapSchemes}>
          {/* District Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Select District</label>
            <select
              required
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">-- Select District --</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Search Schemes</label>
            <Input
              type="text"
              placeholder="🔍 Search scheme..."
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
            />
          </div>

          {/* Scheme Checkboxes */}
          <div className="border p-3 rounded-lg max-h-40 overflow-y-auto space-y-2">
            {filteredSchemes.map((s) => (
              <label
                key={s.schemeId}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSchemes.includes(s.schemeId!)}
                  onChange={() => toggleSchemeSelection(s.schemeId!)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{s.schemeName}</span>
              </label>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mapLoading}>
              {mapLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "✅ Map Schemes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* ✅ Add New Scheme */}
    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-2 h-9 px-4"
        >
          <Plus className="w-4 h-4" /> Add Scheme
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New Scheme</DialogTitle>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleAddScheme}>
          {/* Dropdown Section */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg mb-3">
            <div>
              <label className="block text-xs font-medium mb-1">Financial Year</label>
              <select
                name="financialYearId"
                value={form.financialYearId}
                onChange={handleInput}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                {financialYears.map((fy) => (
                  <option key={fy.id} value={fy.id}>
                    {fy.name}
                  </option>
                ))}
              </select>
            </div>
            

            <div>
              <label className="block text-xs font-medium mb-1">Plan Type</label>
              <select
                name="planType"
                value={form.planType}
                onChange={handleInput}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                {planTypeOptions.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Sector</label>
              <select
                name="sectorId"
                value={form.sectorId}
                onChange={handleInput}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Scheme Type</label>
              <select
                name="baseSchemeType"
                value={form.baseSchemeType}
                onChange={handleInput}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                {schemeTypeOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            

            
          </div>

          {/* Input Section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Scheme Name</label>
              <Input
                name="schemeName"
                value={form.schemeName}
                onChange={handleInput}
                required
              />
            </div>
            {/* <div>
              <label className="block text-xs font-medium mb-1">Scheme Code</label>
              <Input
                name="schemeCode"
                value={form.schemeCode}
                onChange={handleInput}
                required
              />
            </div> */}
            <div>
              <label className="block text-xs font-medium mb-1">CRC Code</label>
              <Input
                name="crcCode"
                value={form.crcCode}
                onChange={handleInput}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Object Code</label>
              <Input
                name="objectCode"
                value={form.objectCode}
                onChange={handleInput}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Object Name</label>
              <Input
                name="objectName"
                value={form.objectName}
                onChange={handleInput}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Major Head Name</label>
              <Input
                name="majorHeadName"
                value={form.majorHeadName}
                onChange={handleInput}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1">Description</label>
              <Input
                name="description"
                value={form.description}
                onChange={handleInput}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={addLoading}>
              {addLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Add Scheme"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</CardHeader>



      </Card>
      <Card className="border shadow-md py-4">
                {/* Filters + Table */}
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <select value={fy} onChange={(e) => setFy(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
              <option value="">All Years</option>
              {financialYears.map((fy) => (
                <option key={fy.id} value={fy.name}>{fy.name}</option>
              ))}
            </select>
            <select value={planType} onChange={(e) => setPlanType(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
              <option value="">All Plan Types</option>
              {planTypeOptions.map((pt) => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="border rounded-md px-3 py-2 text-sm">
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <select value={schemeType} onChange={(e) => setSchemeType(e.target.value as SchemeTypeEnum | "")} className="border rounded-md px-3 py-2 text-sm">
              <option value="">All Scheme Types</option>
              {schemeTypeOptions.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          

        </CardContent>
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100 border-b border-gray-200 ">
                <tr>
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-left">
                    Sr No
                  </th>
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-left">
                    Financial Year
                  </th>
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-left">
                    Scheme
                  </th>
                  {/* <th className="px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-left">Plan Type</th> */}
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-right">
                    Allocated Budget
                  </th>
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-right">
                    Estimated Budget
                  </th>
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-right">
                    Revised Budget
                  </th>
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-right">
                    Next Year Budget
                  </th>
                  <th className="text-xs px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-left">
                    District
                  </th>
                  {/* Uncomment below columns if needed */}
                  {/* <th className="px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-right">District Allocated</th> */}
                  {/* <th className="px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-right">District Utilized</th> */}
                  {/* <th className="px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-right">District Remaining</th> */}
                  {/* <th className="px-4 py-2 text-sm font-semibold text-gray-800 border-r border-gray-300 text-left">Scheme Type</th> */}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="text-center py-3 border border-gray-300">
                      <Loader2 className="animate-spin mx-auto h-6 w-6" />
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-100 transition-colors">
                      {/* Sr. No. */}
                      <td className="px-4 py-2 border border-gray-300">{i + 1}</td>

                      {/* Financial Year */}
                      <td className="px-4 py-2 border border-gray-300">
                        {s.financialYear || "0"}
                      </td>

                      {/* Scheme Name */}
                      <td className="px-4 py-2 border border-gray-300">{s.schemeName}</td>

                      {/* Plan Type (Uncomment if needed) */}
                      {/* <td className="px-4 py-2 border border-gray-300">{s.planType}</td> */}

                      {/* Allocated Budget */}
                      <td className="px-4 py-2 border border-gray-300 text-right">
                        {s.allocatedBudget || "0"}
                      </td>

                      {/* Estimated Budget */}
                      <td className="px-4 py-2 border border-gray-300 text-right">
                        {s.estimatedBudget || "0"}
                      </td>

                      {/* Revised Budget */}
                      <td className="px-4 py-2 border border-gray-300 text-right">
                        {s.revisedBudget || "0"}
                      </td>

                      {/* Next Year Budget */}
                      <td className="px-4 py-2 border border-gray-300 text-right">
                        {s.nextBudget || "0"}
                      </td>

                      {/* District Name */}
                      <td className="px-4 py-2 border border-gray-300">
                        {s.districtName || "-"}
                      </td>

                      {/* Extra Columns (Uncomment if needed) */}
                      {/* <td className="px-4 py-2 border border-gray-300 text-right">{s.districtAllocatedLimit || "0"}</td> */}
                      {/* <td className="px-4 py-2 border border-gray-300 text-right">{s.districtUtilizedLimit || "0"}</td> */}
                      {/* <td className="px-4 py-2 border border-gray-300 text-right">{s.districtRemainingLimit || "0"}</td> */}
                      {/* <td className="px-4 py-2 border border-gray-300">{s.schemeTypeName || "-"}</td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={12}
                      className="text-center py-6 border border-gray-300 text-gray-500"
                    >
                      No schemes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </Card>
    </div>
  );
};

export default SchemeMaster;
