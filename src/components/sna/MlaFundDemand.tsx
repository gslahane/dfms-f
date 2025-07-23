import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from '@/components/ui/dialog';
import { Eye, FileText } from 'lucide-react';
import MlaFundDemandDetails from './MlaFundDemandDetails';

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
  status: 'Approved' | 'Pending';
  remarks: string;
}

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
  status: 'Approved' | 'Pending';
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
  // for work 467
  { id: "MLD-467-1", workId: 467, amount: 500, date: "2025-02-01", status: "Pending",   remarks: "First Installment"  },

  // for work 468
  { id: "MLD-468-1", workId: 468, amount: 500, date: "2025-02-02", status: "Pending",   remarks: "First Installment"  },

  // for work 469
  { id: "MLD-469-1", workId: 469, amount: 500, date: "2025-02-03", status: "Pending",   remarks: "First Installment"  },

  // for work 470
  { id: "MLD-470-1", workId: 470, amount: 500, date: "2025-02-04", status: "Pending",   remarks: "First Installment"  },

  // for work 473
  { id: "MLD-473-1", workId: 473, amount: 500, date: "2025-02-05", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-473-2", workId: 473, amount: 500, date: "2025-03-05", status: "Approved",  remarks: "Second Installment" },

  // for work 474
  { id: "MLD-474-1", workId: 474, amount: 500, date: "2025-02-06", status: "Pending",   remarks: "First Installment"  },

  // for work 475
  { id: "MLD-475-1", workId: 475, amount: 500, date: "2025-02-07", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-475-2", workId: 475, amount: 500, date: "2025-03-07", status: "Approved",  remarks: "Second Installment" },

  // for work 476
  { id: "MLD-476-1", workId: 476, amount: 500, date: "2025-02-08", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-476-2", workId: 476, amount: 500, date: "2025-03-08", status: "Approved",  remarks: "Second Installment" },

  // for work 477
  { id: "MLD-477-1", workId: 477, amount: 500, date: "2025-02-09", status: "Pending",   remarks: "First Installment"  },
  { id: "MLD-477-2", workId: 477, amount: 500, date: "2025-03-09", status: "Approved",  remarks: "Second Installment" },
];


export default function DashboardMLADemand() {
  const [fyFilter, setFyFilter] = useState<'All' | string>('All');
  const [districtFilter, setDistrictFilter] = useState<'All' | string>('All');
  const [constituencyFilter, setConstituencyFilter] = useState<'All' | string>('All');
  const [mlaFilter, setMlaFilter] = useState<'All' | string>('All');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDemandId, setDetailDemandId] = useState<string | null>(null);

  const fyOptions = useMemo(() => ['All', ...new Set(works.map(w => w.financialYear))], []);
  const districtOptions = useMemo(() => ['All', ...new Set(works.map(w => w.district))], []);
  const constituencyOptions = useMemo(() => ['All', ...new Set(works.map(w => w.constituency))], []);
  const mlaOptions = useMemo(() => ['All', ...new Set(works.map(w => w.mlaName))], []);

  const filteredDemands = useMemo(() => {
    return demands.filter(d => {
      const w = works.find(w => w.id === d.workId)!;
      if (fyFilter !== 'All' && w.financialYear !== fyFilter) return false;
      if (districtFilter !== 'All' && w.district !== districtFilter) return false;
      if (constituencyFilter !== 'All' && w.constituency !== constituencyFilter) return false;
      if (mlaFilter !== 'All' && w.mlaName !== mlaFilter) return false;
      return true;
    });
  }, [fyFilter, districtFilter, constituencyFilter, mlaFilter]);

  const openDetails = (id: string) => {
    setDetailDemandId(id);
    setDetailOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4">
          {[
            { label: 'Financial Year',      value: fyFilter,        onChange: setFyFilter,        options: fyOptions },
            { label: 'Nodal District',      value: districtFilter,  onChange: setDistrictFilter,  options: districtOptions },
            { label: 'Assembly Constituency',        value: constituencyFilter,onChange: setConstituencyFilter,options: constituencyOptions },
            { label: 'MLA/MLC Name',            value: mlaFilter,       onChange: setMlaFilter,       options: mlaOptions },
          ].map(({ label, options, value, onChange }) => (
            <div key={label} className="flex flex-col">
              <span className="text-gray-600 text-xs mb-1">{label}</span>
              <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-10 bg-white text-sm rounded-sm border border-gray-300">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {options.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Demands Table */}
      <Card>
        <CardHeader>
<CardTitle className="text-lg text-gray-800">MLA/MLC Fund Demands</CardTitle>
<span className="text-sm text-red-600 italic">
  *All Amounts Are in Thousands
</span>

        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="border px-3 py-2 text-left">Sr No</th>
                <th className="border px-3 py-2 text-left">District</th>
                <th className="border px-3 py-2 text-left">Demand ID</th>
                <th className="border px-3 py-2 text-left">MLA/MLC Account Name</th>
                <th className="border px-3 py-2 text-right">AA Amount</th>
                <th className="border px-3 py-2 text-right">Gross Work Order Amt</th>
                <th className="border px-3 py-2 text-right">Demand Amount</th>
                {/* <th className="border px-3 py-2 text-center">Remarks</th> */}
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemands.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-gray-500">No records found</td>
                </tr>
              ) : (
                filteredDemands.map((d, idx) => {
  const w = works.find(w => w.id === d.workId);
  if (!w) return null; // or skip rendering

  const gross = w.workPortionAmount + w.taxDeductionAmount;
                  return (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{w.district}</td>
                      <td className="border px-3 py-2">{d.id}</td>
                      <td className="border px-3 py-2">{w.mlaName}</td>
                      <td className="border px-3 py-2 text-right">{w.adminApprovedAmount}</td>
                      <td className="border px-3 py-2 text-right">{gross}</td>
                      <td className="border px-3 py-2 text-right">{d.amount.toLocaleString()}</td>
                      <td className="border px-3 py-2 text-center">
                        <Dialog open={detailOpen && detailDemandId === d.id} onOpenChange={setDetailOpen} >
                          <DialogTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => openDetails(d.id)}>
                              <Eye className="w-5 h-5 text-blue-600" />
                            </Button>
                          </DialogTrigger>
                        <DialogContent className="w-[90vw] max-w-[1200px]">
                              <MlaFundDemandDetails
                              open={detailOpen && detailDemandId === d.id}
                              onClose={() => setDetailOpen(false)}
                              demand={d}
                              work={w}
                              demands={demands}
                            />
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
);
}
