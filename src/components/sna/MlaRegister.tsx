// src/components/MlaMaster.tsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Check, Pencil } from "lucide-react";

// Searchable combobox bits (shadcn/ui)
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

/* ----------------------------------------------------------------------------
 * UPDATED MOCK: mlaMlcData (now includes phone & email)
 * -------------------------------------------------------------------------- */
const mlaMlcData = {
  financialYear: "2024-2025",
  planType: "ML",
  data: [
    {
      district: "PUNE",
      taluka: "Pimpri",
      type: "MLA",
      term: 15,
      name: "Anna Dadu Bansode",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 20000,
      phone: "9876500010",
      email: "anna.bansode@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Baramati",
      type: "MLA",
      term: 15,
      name: "Ajit Anantrao Pawar",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 10000,
      phone: "9876500020",
      email: "ajit.pawar@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Khed Alandi",
      type: "MLA",
      term: 15,
      name: "Babaji Ramchandra Kale",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 10000,
      phone: "9876500030",
      email: "babaji.kale@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Vadgaon Sheri",
      type: "MLA",
      term: 15,
      name: "Bapusaheb Tukaram Pathare",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500040",
      email: "bapusaheb.pathare@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Khadakwasala",
      type: "MLA",
      term: 15,
      name: "Bhimrao Dhondiba Tapkir",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500050",
      email: "bhimrao.tapkir@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Bhosari",
      type: "MLA",
      term: 15,
      name: "Mahesh Landge",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500060",
      email: "mahesh.landge@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Hadapsar",
      type: "MLA",
      term: 15,
      name: "Chetan Tupe",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500070",
      email: "chetan.tupe@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Kothrud",
      type: "MLA",
      term: 15,
      name: "Chandrakant Bachhu Patil",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500080",
      email: "chandrakant.patil@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Indapur",
      type: "MLA",
      term: 15,
      name: "Dattatraya Vithoba Bharne",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500090",
      email: "dattatraya.bharne@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Shirur",
      type: "MLA",
      term: 15,
      name: "Dnyaneshwar Katke",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500100",
      email: "dnyaneshwar.katke@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Ambegaon",
      type: "MLA",
      term: 15,
      name: "Dilip Walse-Patil",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500110",
      email: "dilip.walsepatil@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Kasba Peth",
      type: "MLA",
      term: 15,
      name: "Hemant Narayan Rasane",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500120",
      email: "hemant.rasane@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Chinchwad",
      type: "MLA",
      term: 15,
      name: "Shankar Jagtap",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500130",
      email: "shankar.jagtap@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Bhor",
      type: "MLA",
      term: 15,
      name: "Shankar Hiraman Mandekar",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500140",
      email: "shankar.mandekar@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Shivajinagar",
      type: "MLA",
      term: 15,
      name: "Siddharth Shirole",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500150",
      email: "siddharth.shirole@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Pune Cantonment",
      type: "MLA",
      term: 15,
      name: "Suni Dnyandev Kamble",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500160",
      email: "suni.kamble@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Maval",
      type: "MLA",
      term: 15,
      name: "Sunil Shankarrao Shelke",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500170",
      email: "sunil.shelke@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Parvati",
      type: "MLA",
      term: 15,
      name: "Madhuri Satish Misal",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500180",
      email: "madhuri.misal@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Daund",
      type: "MLA",
      term: 15,
      name: "Rahul Subhashrao Kul",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500190",
      email: "rahul.kul@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Junnar",
      type: "MLA",
      term: 15,
      name: "Sharad Sonavane",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500200",
      email: "sharad.sonavane@mla.gov.in"
    },
    {
      district: "PUNE",
      taluka: "Purandar",
      type: "MLA",
      term: 15,
      name: "Vijay Shivtare",
      schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
      budget: 50000,
      fundUtilized: 0,
      balance: 50000,
      pendingDemands: 0,
      phone: "9876500210",
      email: "vijay.shivtare@mla.gov.in"
    }
    // If you add MLC entries later, also include phone/email fields similarly.
  ]
};

/* ----------------------------------------------------------------------------
 * TYPES & UTILS
 * -------------------------------------------------------------------------- */
type UserType = "MLA" | "MLC";
type Status = "Active" | "Inactive";

interface UserRecord {
  id: string;
  type: UserType;
  name: string;
  district: string;          // Nodal district
  constituency: string;      // Assembly constituency (taluka)
  phone: string;
  email: string;
  term: number;
  status: Status;
  deactivationLetterName?: string;
}

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

/* ----------------------------------------------------------------------------
 * SearchableSelect (combobox)
 * -------------------------------------------------------------------------- */
function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(
    () => [...options].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })),
    [options]
  );
  const display = value || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className={cn(!value && "text-muted-foreground")}>{display}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[220px]" align="start">
        <Command>
          <CommandInput placeholder="Type to search…" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {sorted.map(opt => {
              const selected = value === opt;
              return (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={(val) => { onValueChange(val); setOpen(false); }}
                  className="cursor-pointer"
                >
                  <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{opt}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ----------------------------------------------------------------------------
 * MAIN COMPONENT
 * -------------------------------------------------------------------------- */
export default function MlaMaster() {
  /* --------------------------- Seed -> Table Data ------------------------ */
  const seedRecords: UserRecord[] = useMemo(() => {
    return (mlaMlcData.data || []).map((r, i) => ({
      id: `${r.type}-${i + 1}`,
      type: (r.type as UserType) || "MLA",
      name: r.name || "",
      district: r.district || "",
      constituency: r.taluka || "",
      phone: (r as any).phone || "",   // << now reads from mock
      email: (r as any).email || "",   // << now reads from mock
      term: Number((r as any).term ?? 0),
      status: "Active",
    }));
  }, []);

  const [rows, setRows] = useState<UserRecord[]>(seedRecords);

  /* ------------------------------- Filters ------------------------------- */
  const [fType, setFType] = useState<"All" | UserType>("All");
  const [fDistrict, setFDistrict] = useState<string>("All");
  const [fConst, setFConst] = useState<string>("All");
  const [fStatus, setFStatus] = useState<"All" | Status>("All");

  const typeOptions = useMemo(() => ["All", "MLA", "MLC"] as const, []);
  const districtOptions = useMemo(() => ["All", ...uniq(rows.map(r => r.district))], [rows]);
  const constituencyOptions = useMemo(
    () => ["All", ...uniq(rows.map(r => r.constituency))],
    [rows]
  );
  const statusOptions = useMemo(() => ["All", "Active", "Inactive"] as const, []);

  const filtered = useMemo(() => {
    return rows
      .filter(r => (fType === "All" ? true : r.type === fType))
      .filter(r => (fDistrict === "All" ? true : r.district === fDistrict))
      .filter(r => (fConst === "All" ? true : r.constituency === fConst))
      .filter(r => (fStatus === "All" ? true : r.status === fStatus))
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  }, [rows, fType, fDistrict, fConst, fStatus]);

  const total = filtered.length;
  const activeCount = filtered.filter(r => r.status === "Active").length;
  const inactiveCount = total - activeCount;

  /* ----------------------------- Create / Edit --------------------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [letterError, setLetterError] = useState<string>("");

  interface FormState {
    id?: string;
    type: UserType;
    name: string;
    district: string;
    constituency: string;
    phone: string;
    email: string;
    term: number | "";
    status: Status;
    deactivationLetter?: File | null;
    deactivationLetterName?: string;
  }

  const blankForm: FormState = {
    type: "MLA",
    name: "",
    district: "",
    constituency: "",
    phone: "",
    email: "",
    term: "",
    status: "Active",
    deactivationLetter: null,
    deactivationLetterName: undefined,
  };

  const [form, setForm] = useState<FormState>(blankForm);

  const districtFormOptions = useMemo(() => uniq(rows.map(r => r.district)), [rows]);
  const constituencyFormOptions = useMemo(
    () =>
      uniq(
        rows
          .filter(r => !form.district || r.district === form.district)
          .map(r => r.constituency)
      ),
    [rows, form.district]
  );

  const openCreate = () => {
    setIsEdit(false);
    setLetterError("");
    setForm(blankForm);
    setDialogOpen(true);
  };

  const openEdit = (rec: UserRecord) => {
    setIsEdit(true);
    setLetterError("");
    setForm({
      id: rec.id,
      type: rec.type,
      name: rec.name,
      district: rec.district,
      constituency: rec.constituency,
      phone: rec.phone,
      email: rec.email,
      term: rec.term || "",
      status: rec.status,
      deactivationLetter: null,
      deactivationLetterName: rec.deactivationLetterName,
    });
    setDialogOpen(true);
  };

  const updateForm = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter a Name.";
    if (!form.district) return "Please select a Nodal District.";
    if (form.type === "MLA" && !form.constituency) return "Please select an Assembly Constituency.";
    if (!String(form.term).trim()) return "Please enter Term.";
    if (form.status === "Inactive" && !form.deactivationLetter && !form.deactivationLetterName) {
      return "Please upload a deactivation letter to set the user Inactive.";
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid Email.";
    if (form.phone && !/^\d{7,15}$/.test(form.phone)) return "Please enter a valid Phone number (7–15 digits).";
    return null;
  };

  const handleSave = () => {
    const err = validate();
    setLetterError(err || "");
    if (err) return;

    if (isEdit && form.id) {
      setRows(prev =>
        prev.map(r =>
          r.id === form.id
            ? {
                ...r,
                type: form.type,
                name: form.name.trim(),
                district: form.district,
                constituency: form.type === "MLC" ? (form.constituency || "—") : form.constituency,
                phone: form.phone,
                email: form.email,
                term: Number(form.term || 0),
                status: form.status,
                deactivationLetterName:
                  form.status === "Inactive"
                    ? (form.deactivationLetter?.name || form.deactivationLetterName)
                    : undefined,
              }
            : r
        )
      );
    } else {
      const newId = `${form.type}-${Date.now().toString(36).slice(-6)}`;
      const newRec: UserRecord = {
        id: newId,
        type: form.type,
        name: form.name.trim(),
        district: form.district,
        constituency: form.type === "MLC" ? (form.constituency || "—") : form.constituency,
        phone: form.phone,
        email: form.email,
        term: Number(form.term || 0),
        status: form.status,
        deactivationLetterName:
          form.status === "Inactive" ? (form.deactivationLetter?.name || undefined) : undefined,
      };
      setRows(prev => [newRec, ...prev]);
    }

    setDialogOpen(false);
    setForm(blankForm);
  };

  /* --------------------------------- UI ---------------------------------- */
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header + Create */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">MLA / MLC User Master</h1>
          <p className="text-gray-600">Manage members, contact details and account status</p>
        </div>
        <div className="flex gap-3 items-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="px-4 py-2 rounded-sm shadow">Create User</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type */}
                <div className="sm:col-span-2">
                  <Label className="mb-1 block">Type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={form.type === "MLA" ? "default" : "outline"}
                      onClick={() => updateForm("type", "MLA")}
                    >
                      MLA
                    </Button>
                    <Button
                      type="button"
                      variant={form.type === "MLC" ? "default" : "outline"}
                      onClick={() => updateForm("type", "MLC")}
                    >
                      MLC
                    </Button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label className="mb-1 block">Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="e.g. Ajit Pawar"
                  />
                </div>

                {/* Term */}
                <div>
                  <Label className="mb-1 block">Term</Label>
                  <Input
                    type="number"
                    value={form.term}
                    onChange={(e) => updateForm("term", e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 15"
                  />
                </div>

                {/* District */}
                <div>
                  <Label className="mb-1 block">Nodal District</Label>
                  <SearchableSelect
                    value={form.district}
                    onValueChange={(v) => {
                      updateForm("district", v);
                      updateForm("constituency", "");
                    }}
                    options={uniq(rows.map(r => r.district))}
                  />
                </div>

                {/* Constituency (required for MLA, optional for MLC) */}
                <div>
                  <Label className="mb-1 block">
                    Assembly Constituency{form.type === "MLA" ? " *" : " (optional)"}
                  </Label>
                  <SearchableSelect
                    value={form.constituency}
                    onValueChange={(v) => updateForm("constituency", v)}
                    options={uniq(rows.filter(r => !form.district || r.district === form.district).map(r => r.constituency))}
                    placeholder={form.type === "MLA" ? "Select constituency" : "—"}
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label className="mb-1 block">Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="9876543210"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label className="mb-1 block">Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="member@example.gov"
                  />
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <Label className="mb-1 block">Status</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={form.status === "Active" ? "default" : "outline"}
                      onClick={() => updateForm("status", "Active")}
                    >
                      Active
                    </Button>
                    <Button
                      type="button"
                      variant={form.status === "Inactive" ? "default" : "outline"}
                      onClick={() => updateForm("status", "Inactive")}
                    >
                      Inactive
                    </Button>
                  </div>

                  {form.status === "Inactive" && (
                    <div className="mt-3">
                      <Label className="mb-1 block">Upload Deactivation Letter (PDF/Image)</Label>
                      <Input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          updateForm("deactivationLetter", file);
                          updateForm("deactivationLetterName", file?.name || "");
                          setLetterError("");
                        }}
                      />
                      {letterError && (
                        <p className="text-xs text-red-600 mt-1">{letterError}</p>
                      )}
                      {form.deactivationLetterName && (
                        <p className="text-xs text-gray-600 mt-1">
                          Attached: <span className="font-medium">{form.deactivationLetterName}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>{isEdit ? "Save Changes" : "Create User"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
        >
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{filtered.length}</p>
        </motion.div>
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <p className="text-sm font-medium text-gray-600">Active</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{filtered.filter(r => r.status === "Active").length}</p>
        </motion.div>
        <motion.div
          className="border border-gray-200 rounded-sm bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-medium text-gray-600">Inactive</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{filtered.filter(r => r.status === "Inactive").length}</p>
        </motion.div>
      </div>

      {/* Data Table */}
      <Card className="border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">MLA/MLC Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "S.No",
                  "Type",
                  "Name",
                  "Nodal District",
                  "Assembly Constituency",
                  "Phone",
                  "Email",
                  "Term",
                  "Status",
                  "Actions",
                ].map(h => (
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
              {filtered.map((r, idx) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 text-sm">{idx + 1}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.type}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.name}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.district}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.constituency || "—"}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.phone || "—"}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.email || "—"}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">{r.term || "—"}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 text-xs font-medium rounded-full",
                        r.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}
                    >
                      {r.status}
                    </span>
                    {r.status === "Inactive" && r.deactivationLetterName && (
                      <span className="ml-2 text-[10px] text-gray-500 italic">
                        ({r.deactivationLetterName})
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)} title="Edit">
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="border border-gray-200 py-4 text-center text-gray-400 text-sm">
                    No records found.
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
