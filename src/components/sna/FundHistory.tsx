// src/components/WorkDemandTable.tsx
import React, { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Eye } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Work {
  id: number;
  workCode: string;
  name: string;
  district: string;
  constituency: string;
  mlaName: string;
  financialYear: string;
  adminApprovedAmount: number;
  workPortionAmount: number;
  taxDeductionAmount: number;
  vendor: {
    id: string;
    name: string;
    aadhar: string;
  };
}

interface Demand {
  id: string;
  workId: number;
  amount: number;
  date: string;
  status: "Pending" | "Approved";
  remarks: string;
}

const works: Work[] = [
  {
    id: 467,
    workCode: "ML/2425/2572",
    name: "ML/2425/2572 आमदार स्थानिक विकास कार्यक्रम सन २०२४-२५ अंतर्गत बारामती येथे होणाऱ्या शिवछत्रपती राज्य स्तरीय कबड्डी स्पर्धेकरिता निधी उपलब्ध करणेबाबत",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    financialYear: "2024-25",
    adminApprovedAmount: 2999,
    workPortionAmount: 2800,
    taxDeductionAmount: 100,
    vendor: {
      id: "1189",
      name: "Shree Ganesh Constructions Pvt. Ltd.",
      aadhar: "123412341234",
    },
  },
  {
    id: 468,
    workCode: "ML/2425/2151",
    name: "ML/2425/2151 जांबूत येथे जांबूत चोंभूत रोड ते कळमजाई मंदिर रस्ता करणे ता.शिरुर",
    district: "Pune",
    constituency: "Shirur",
    mlaName: "Dnyaneshwar Katke",
    financialYear: "2024-25",
    adminApprovedAmount: 1400,
    workPortionAmount: 1200,
    taxDeductionAmount: 110,
    vendor: {
      id: "1189",
      name: "Maratha Nirman & Co.",
      aadhar: "987654321098",
    },
  },
  {
    id: 469,
    workCode: "ML/2425/2569",
    name: "ML/2425/2569 आमदार स्थानिक विकास कार्यक्रम सन २०२४-२५ अंतर्गत बारामती येथे होणाऱ्या शिवछत्रपती राज्य स्तरीय कबड्डी स्पर्धेकरिता निधी उपलब्ध करणेबाबत",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    financialYear: "2024-25",
    adminApprovedAmount: 1990,
    workPortionAmount: 1800,
    taxDeductionAmount: 100,
    vendor: {
      id: "1189",
      name: "Sadguru Infrastructure Ltd.",
      aadhar: "456789123456",
    },
  },
  {
    id: 470,
    workCode: "ML/2425/0325",
    name: "ML/2425/0325 मौजे वेहेरगाव येथे भैरवनाथ मंदिरासमोरील ग्रामपंचायतीच्या मोकळ्या जागेत सभामंडप बांधणे.ता.मावळ.जि.पुणे ग्रामपंचायत वेहेरगाव मालमत्ता क्रमांक 120 Lat18.784103 Long73.465508",
    district: "Pune",
    constituency: "Maval",
    mlaName: "Sunil Shankarrao Shelke",
    financialYear: "2024-25",
    adminApprovedAmount: 1600,
    workPortionAmount: 1400,
    taxDeductionAmount: 100,
    vendor: {
      id: "1189",
      name: "Maharashtra Builders & Developers",
      aadhar: "321098765432",
    },
  },
  {
    id: 477,
    workCode: "ML/2425/2561",
    name: "ML/2425/2561 बारामती येथे आयोजित करण्यात येणा-या शिवछत्रपती राज्यस्तरीय कब्बडी स्पर्धेकरिता 10 लक्ष निधी देणे",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    financialYear: "2024-25",
    adminApprovedAmount: 1000,
    workPortionAmount: 1000,
    taxDeductionAmount: 0,
    vendor: {
      id: "1189",
      name: "Sahyadri Construction Co.",
      aadhar: "147852369258",
    },
  },
];

const demands: Demand[] = [
  { id: "MLD-467-1", workId: 467, amount: 500, date: "2025-02-01", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-468-1", workId: 468, amount: 500, date: "2025-02-02", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-469-1", workId: 469, amount: 500, date: "2025-02-03", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-470-1", workId: 470, amount: 500, date: "2025-02-04", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-473-1", workId: 473, amount: 500, date: "2025-02-05", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-473-2", workId: 473, amount: 500, date: "2025-03-05", status: "Approved",  remarks: "Second Installment" },
  { id: "MLD-474-1", workId: 474, amount: 500, date: "2025-02-06", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-475-1", workId: 475, amount: 500, date: "2025-02-07", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-475-2", workId: 475, amount: 500, date: "2025-03-07", status: "Approved",  remarks: "Second Installment" },
  { id: "MLD-476-1", workId: 476, amount: 500, date: "2025-02-08", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-476-2", workId: 476, amount: 500, date: "2025-03-08", status: "Approved",  remarks: "Second Installment" },
  { id: "MLD-477-1", workId: 477, amount: 500, date: "2025-02-09", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-477-2", workId: 477, amount: 500, date: "2025-03-09", status: "Approved",  remarks: "Second Installment" },
];

export default function WorkDemandTable() {
  // filter state
  const [fy, setFy] = useState("");
  const [district, setDistrict] = useState("");
  const [mla, setMla] = useState("");
  const [open, setOpen] = useState<Demand | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // generate filter options
  const fys       = useMemo(() => [...new Set(works.map(w => w.financialYear))], []);
  const districts= useMemo(() => [...new Set(works.map(w => w.district))], []);
  const mlas     = useMemo(() => [...new Set(works.map(w => w.mlaName))], []);

  // filtered demands
  const filtered = useMemo(() => {
    return demands.filter(d => {
      const w = works.find(w => w.id === d.workId);
      if (!w) return false;
      return (
        (!fy       || w.financialYear === fy) &&
        (!district|| w.district === district) &&
        (!mla      || w.mlaName === mla)
      );
    });
  }, [fy, district, mla]);

  // PDF download
  const downloadPDF = async () => {
    if (!receiptRef.current || !open) return;
    const canvas = await html2canvas(receiptRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 20;
    const w = pdf.internal.pageSize.getWidth() - margin * 2;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", margin, margin, w, h);
    pdf.save(`${open.id}.pdf`);
  };

  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB");

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <Card className="border rounded shadow-sm">
        <CardHeader className="flex flex-wrap items-center gap-4">
          <CardTitle className="flex-1 text-xl">MLA/MLC Fund Demands</CardTitle>
          <div className="flex gap-3 flex-wrap">
            <Select value={fy} onValueChange={setFy}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All FYs" /></SelectTrigger>
              <SelectContent>
                {fys.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-32"><SelectValue placeholder="All Districts" /></SelectTrigger>
              <SelectContent>
                {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={mla} onValueChange={setMla}>
              <SelectTrigger className="w-48"><SelectValue placeholder="All MLAs/MLCs" /></SelectTrigger>
              <SelectContent>
                {mlas.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {["FY","District","MLA/MLC Name","Demand ID","Amount","Date","Status","Details"].map(col => (
                    <th key={col} className="border px-3 py-2 text-left text-sm font-medium">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-500">No records.</td>
                  </tr>
                ) : filtered.map(d => {
                  const w = works.find(w => w.id === d.workId)!;
                  return (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2 text-sm">{w.financialYear}</td>
                      <td className="border px-3 py-2 text-sm">{w.district}</td>
                      <td className="border px-3 py-2 text-sm">{w.mlaName}</td>
                      <td className="border px-3 py-2 text-sm">{d.id}</td>
                      <td className="border px-3 py-2 text-sm">₹{d.amount.toLocaleString()}</td>
                      <td className="border px-3 py-2 text-sm">{d.date}</td>
                      <td className="border px-3 py-2 text-sm">{d.status}</td>
                      <td className="border px-3 py-2 text-center">
                        <Button size="sm" variant="ghost" onClick={() => setOpen(d)}>
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
{open && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setOpen(null)}
  >
    <div
      ref={receiptRef}
      className="relative bg-white rounded-md shadow-lg w-full max-w-3xl p-6 space-y-4 text-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={() => setOpen(null)}
        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
      >
        <X size={18} />
      </button>

      {/* Header */}
      <div className="text-center space-y-1">
        <img src="./logo.png" alt="Gov Seal" className="h-12 mx-auto" />
        <h2 className="text-base font-bold">Government of Maharashtra</h2>
        <p className="text-xs text-gray-600 -mt-1">Finance Department</p>
        <p className="text-xs font-medium">Work Payment Receipt</p>
      </div>

      {/* Voucher Meta */}
      <div className="flex justify-between text-xs text-gray-700 border-y py-1">
        <span><strong>Voucher ID:</strong> {open.id}</span>
        <span><strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}</span>
        <span><strong>Time:</strong> {new Date().toLocaleTimeString("en-IN")}</span>
      </div>

      {/* Main Grid */}
      {(() => {
        const w = works.find(w => w.id === open.workId)!;
        const deductions = w.taxDeductionAmount || 0;
        const gross = open.amount + deductions;

        const toWords = (num: number) => {
          // Replace with proper words conversion if needed
          return num.toLocaleString("en-IN") + " Rupees Only";
        };

        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="border rounded p-3 bg-gray-50">
                <p><strong>FY:</strong> {w.financialYear}</p>
                <p><strong>District:</strong> {w.district}</p>
                <p><strong>Scheme:</strong> {w.scheme || "N/A"}</p>
                <p><strong>Work Title:</strong> {w.name}</p>
                <p><strong>IA Name:</strong> {w.implementingAgency || "N/A"}</p>
              </div>
              <div className="border rounded p-3 bg-gray-50">
                <p><strong>Admin Approved Amount:</strong> ₹{w.adminApprovedAmount.toLocaleString()}</p>
                <p><strong>Gross Work Order:</strong> ₹{gross.toLocaleString()}</p>
                <p><strong>Previously Released:</strong> ₹{w.fundsReleasedBefore?.toLocaleString() || "0"}</p>
                <p><strong>Disbursed Now:</strong> ₹{open.amount.toLocaleString()}</p>
                <p><strong>Amount in Words:</strong> {toWords(open.amount)}</p>
              </div>
            </div>

            {/* Vendor + Bank Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="border rounded p-3 bg-gray-50">
                <p><strong>Vendor:</strong> {w.vendor.name}</p>
                <p><strong>Aadhar:</strong> {w.vendor.aadhar}</p>
                <p><strong>Account Number:</strong> ********1234</p>
              </div>
              <div className="border rounded p-3 bg-gray-50">
                <p><strong>Bank:</strong> State Bank of India</p>
                <p><strong>IFSC:</strong> SBIN0000456</p>
                <p><strong>UTR No:</strong> UTR20250717001</p>
              </div>
            </div>
          </>
        );
      })()}

      {/* Signature */}
      <div className="pt-3 border-t text-right text-xs">
        <p className="text-gray-600">Authorized Signatory</p>
        <div className="h-10 border-b w-40 ml-auto mt-1" />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 text-xs">
        <Button variant="outline" size="sm" onClick={() => setOpen(null)}>
          Close
        </Button>
        <Button size="sm" onClick={downloadPDF}>
          Download PDF
        </Button>
      </div>
    </div>
  </div>
)}



    </div>
  );
}
