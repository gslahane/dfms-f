import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { X } from "lucide-react";

interface WorkScheme {
  id: string;
  planType: string;
  scheme: string;
  iaName: string;
  workTitle: string;
  aaAmount: number;
  aaLetterName: string;
  active: boolean;
}

// Dummy existing records
const initialWorks: WorkScheme[] = [
  {
    id: "1",
    planType: "MLA/MLC",
    scheme: "Shri Ajit Dada Pawar",
    iaName: "931 Executive Engineer, Public Works,Pune Division, Pune",
    workTitle: "GP/2425/5100 उपविभागीय दंडाधिकारी हवेली, उपविभाग पुणे यांचे ७ राणीचा बाग येथील कार्यालयीन दुरुस्ती करणे (छत दुरुस्ती, रंगकाम, स्वच्छतागृहाचे नुतनीकरण करणे, फरशी, दरवाजे व खिडक्या दुरुस्ती, पत्र्याचे शेड तयार करणे, पेव्हींग ब्लॉक बसविणे, ड्रेनिज लाईनची दुरुस्ती व इतर अनुषंगिक कामे करणे.)",
    aaAmount: 145000,
    aaLetterName: "AA_Baner.pdf",
    active: true,
  },
  {
    id: "2",
    planType: "MLA/MLC",
    scheme: "Dnyaneshwar Pandharinath katke",
    iaName: "1133 Divisional Forest Officer, Social Forestry Department, Pune",
    workTitle: "ML/2425/2151 जांबूत येथे जांबूत चोंभूत रोड ते कळमजाई मंदिर रस्ता करणे ता.शिरुर",
    aaAmount: 1837087,
    aaLetterName: "AA_LETTER.pdf",
    active: false,
  },
  {
    id: "3",
    planType: "MLA/MLC",
    scheme: "Dnyaneshwar Pandharinath katke",
    iaName: "1083 Deputy Chief Executive Officer (Village Panchayat), Zillha Parishad, Pune",
    workTitle: "ML/2425/1622 जांबुत येथील मळगंगा माता मंदिर परिसरातील ग्रामपंचायत मालकीच्या जागेवर पेव्हर ब्लॉक बसविणे ता. शिरुर",
    aaAmount: 50000,
    aaLetterName: "AA_Saswad.pdf",
    active: true,
  },
];

export default function WorkSchemeMaster() {
  const [records, setRecords] = useState<WorkScheme[]>(initialWorks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<WorkScheme>>({
    planType: "",
    scheme: "",
    iaName: "",
    workTitle: "",
    aaAmount: undefined,
    aaLetterName: "",
  });

  // Options
  const planTypeOptions = ["DAP", "MLA/MLC", "HADP"];
  const schemeOptions = ["Minor Irrigation Works", "Road Development", "Child Development Services"];
  const iaOptions = [
    "MSEB Mulshi Division",
    "Executive Engineer, PWD Pune",
    "Chief Officer, Saswad Municipal Council, District-Pune",
    "Divisional Forest Officer, Social Forestry Department, Pune",
    "Deputy CEO, Zillha Parishad, Pune",
  ];

  // Filters
  const [filter, setFilter] = useState({
    planType: "",
    scheme: "",
    iaName: "",
    workTitle: "",
  });

  const filtered = useMemo(
    () =>
      records.filter(r => {
        if (filter.planType && r.planType !== filter.planType) return false;
        if (filter.scheme && r.scheme !== filter.scheme) return false;
        if (filter.iaName && r.iaName !== filter.iaName) return false;
        if (filter.workTitle && !r.workTitle.toLowerCase().includes(filter.workTitle.toLowerCase())) return false;
        return true;
      }),
    [records, filter]
  );

  const onChange = (key: keyof WorkScheme, value: any) => setForm(f => ({ ...f, [key]: value }));
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files && onChange("aaLetterName", e.target.files[0].name);

  const onAssign = () => {
    if (!form.planType || !form.scheme || !form.iaName || !form.workTitle || form.aaAmount == null) return;
    const newRec: WorkScheme = {
      id: Date.now().toString(),
      planType: form.planType!,
      scheme: form.scheme!,
      iaName: form.iaName!,
      workTitle: form.workTitle!,
      aaAmount: form.aaAmount!,
      aaLetterName: form.aaLetterName || "",
      active: true,
    };
    setRecords(r => [newRec, ...r]);
    setForm({ planType: "", scheme: "", iaName: "", workTitle: "", aaAmount: undefined, aaLetterName: "" });
    setDialogOpen(false);
  };

  const toggleActive = (id: string) => setRecords(r => r.map(rec => rec.id === id ? { ...rec, active: !rec.active } : rec));

  return (
    <div className="p-6 space-y-6">
      {/* Action */}
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          Assign New Work
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Select value={filter.planType} onValueChange={v => setFilter(f => ({ ...f, planType: v }))}>
          <SelectTrigger><SelectValue placeholder="Plan Type"/></SelectTrigger>
          <SelectContent>{planTypeOptions.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filter.scheme} onValueChange={v => setFilter(f => ({ ...f, scheme: v }))}>
          <SelectTrigger><SelectValue placeholder="Scheme"/></SelectTrigger>
          <SelectContent>{schemeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filter.iaName} onValueChange={v => setFilter(f => ({ ...f, iaName: v }))}>
          <SelectTrigger><SelectValue placeholder="Implementing Agency"/></SelectTrigger>
          <SelectContent>{iaOptions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
        </Select>
        <Input placeholder="Search Work" value={filter.workTitle} onChange={e => setFilter(f => ({ ...f, workTitle: e.target.value }))} />
      </div>

      {/* Table */}
      <Card className="border border-gray-300 rounded-lg">
        <CardHeader>
          <CardTitle>Assigned Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {['Sr No','MLA/MLC','IA Name','Work Title','AA Amount','AA Letter','Actions'].map((h, idx) => (
                    <TableHead key={idx} className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, i) => (
                  <TableRow key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <TableCell className="border border-gray-200 px-3 py-2 text-sm">{i+1}</TableCell>
                    <TableCell className="border border-gray-200 px-3 py-2 text-sm">{r.scheme}</TableCell>
                    <TableCell className="border border-gray-200 px-3 py-2 text-sm">{r.iaName}</TableCell>
                    <TableCell className="border border-gray-200 px-3 py-2 text-sm">{r.workTitle}</TableCell>
                    <TableCell className="border border-gray-200 px-3 py-2 text-sm">₹{r.aaAmount.toLocaleString()}</TableCell>
                    <TableCell className="border border-gray-200 px-3 py-2 text-sm">{r.aaLetterName}</TableCell>
                    <TableCell className="border border-gray-200 px-3 py-2 text-sm space-x-2">
                      <Button size="sm" variant={r.active ? 'outline' : 'default'} onClick={() => toggleActive(r.id)}>
                        {r.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="border border-gray-200 py-6 text-center text-gray-500">No works assigned.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Popup Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign New Work</DialogTitle>
            <button className="absolute top-4 right-4" onClick={() => setDialogOpen(false)}><X className="h-5 w-5 text-gray-500"/></button>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={form.planType} onValueChange={v => onChange('planType', v)}>
                <SelectTrigger><SelectValue placeholder="Plan Type"/></SelectTrigger>
                <SelectContent>{planTypeOptions.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.scheme} onValueChange={v => onChange('scheme', v)}>
                <SelectTrigger><SelectValue placeholder="Scheme"/></SelectTrigger>
                <SelectContent>{schemeOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.iaName} onValueChange={v => onChange('iaName', v)}>
                <SelectTrigger><SelectValue placeholder="Implementing Agency"/></SelectTrigger>
                <SelectContent>{iaOptions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Work Title" value={form.workTitle} onChange={e => onChange('workTitle', e.target.value)} />
              <Input type="number" placeholder="AA Amount" value={form.aaAmount || ''} onChange={e => onChange('aaAmount', +e.target.value)} />
              <input type="file" onChange={onFile} className="text-sm text-gray-500" />
            </div>
            <DialogFooter className="flex justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={onAssign}>Save</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
