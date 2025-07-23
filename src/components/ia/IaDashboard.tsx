// src/components/IADashboard.tsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FilePlus2, Users, TrendingUp, PieChart, Eye } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const demandsData = [
  {
    id: 468,
    workCode: "ML/2425/2151",
    name: "ML/2425/2151 जांबूत येथे जांबूत चोंभूत रोड ते कळमजाई मंदिर रस्ता करणे ता.शिरुर",
    district: "Pune",
    constituency: "Shirur",
    mlaName: "Dnyaneshwar Katke",
    schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
    iaName: "928 Executive Engineer, Public Works North Division, Pune",
    financialYear: "2024-25",
    demandAmount: 200000,
    adminApprovedAmount: 1450000,
    workPortionAmount: 1450000,
    taxDeductionAmount: 11000,
    status: "Pending",
  },
  {
    id: 469,
    workCode: "ML/2425/2569",
    name: "ML/2425/2569 आमदार स्थानिक विकास कार्यक्रम सन २०२४-२५ अंतर्गत बारामती येथे होणाऱ्या शिवछत्रपती राज्य स्तरीय कबड्डी स्पर्धेकरिता निधी उपलब्ध करणेबाबत",
    district: "Pune",
    constituency: "Baramati",
    mlaName: "Ajit Anantrao Pawar",
    schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
    iaName: "1189 District Sports Officer, Pune",
    financialYear: "2024-25",
    demandAmount: 1990,
    adminApprovedAmount: 1990,
    workPortionAmount: 1800,
    taxDeductionAmount: 100,
    status: "Pending",
  },
];

export default function IADashboard() {
  const navigate = useNavigate();

  const fyList = ["All", ...Array.from(new Set(demandsData.map(d => d.financialYear)))];
  const schemeList = ["All", ...Array.from(new Set(demandsData.map(d => d.schemeName)))];
  const workList = ["All", ...Array.from(new Set(demandsData.map(d => d.name)))];
  const statusList = ["All", ...Array.from(new Set(demandsData.map(d => d.status)))];

  const [filters, setFilters] = useState({ financialYear: "All", schemeName: "All", name: "All", status: "All" });

  const filtered = useMemo(
    () =>
      demandsData.filter(d =>
        (filters.financialYear === "All" || d.financialYear === filters.financialYear) &&
        (filters.schemeName === "All" || d.schemeName === filters.schemeName) &&
        (filters.name === "All" || d.name === filters.name) &&
        (filters.status === "All" || d.status === filters.status)
      ),
    [filters]
  );

  const stats = useMemo(() => {
    const total = filtered.length;
    const approved = filtered.filter(d => d.status === "Approved").length;
    const pending = filtered.filter(d => d.status === "Pending").length;
    const demandedSum = filtered.reduce((sum, d) => sum + d.demandAmount, 0);
    const approvedSum = filtered.filter(d => d.status === "Approved").reduce((sum, d) => sum + d.demandAmount, 0);
    return { total, approved, pending, demandedSum, approvedSum };
  }, [filtered]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Fund Demand Report", 14, 16);
    autoTable(doc, {
      head: [["#", "MLA/MLC", "IA Name", "Work", "Gross (₹)", "Demand (₹)", "Status"]],
      body: filtered.map((d, i) => [
        i + 1,
        d.mlaName,
        d.iaName,
        d.name,
        `₹${d.adminApprovedAmount.toLocaleString()}`,
        `₹${d.demandAmount.toLocaleString()}`,
        d.status,
      ]),
    });
    doc.save("Fund_Demand_Report.pdf");
  };

  const cardConfig = [
    { title: "Total Demands", value: stats.total, icon: <TrendingUp className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
    { title: "Approved Demands", value: stats.approved, icon: <PieChart className="w-6 h-6 text-green-500" />, bg: "bg-green-50" },
    { title: "Pending Demands", value: stats.pending, icon: <PieChart className="w-6 h-6 text-yellow-500" />, bg: "bg-yellow-50" },
    { title: "Sent Back By District", value: 0, icon: <Eye className="w-6 h-6 text-rose-500" />, bg: "bg-rose-50" },
    { title: "Total Work Amount", value: `₹${stats.demandedSum.toLocaleString()}`, icon: <TrendingUp className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
    { title: "Approved Amount", value: `₹${stats.approvedSum.toLocaleString()}`, icon: <PieChart className="w-6 h-6 text-red-500" />, bg: "bg-red-50" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">IA Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadPDF} variant="outline" className="border-blue-600 text-blue-600">
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
          <Button onClick={() => navigate("/fund-demand")} className="bg-blue-600 text-white hover:bg-blue-700">
            <FilePlus2 className="w-4 h-4 mr-1" /> New Demand
          </Button>
          <Button onClick={() => navigate("/vendor-detail")} variant="outline">
            <Users className="w-4 h-4 mr-1" /> Register Vendor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {cardConfig.map((c, i) => (
          <motion.div key={c.title} initial="hidden" animate="visible" variants={cardVariants} custom={i} className={`${c.bg} p-4 rounded-lg shadow hover:shadow-md flex items-center gap-4`}>
            {c.icon}
            <div>
              <div className="text-sm font-medium text-gray-600">{c.title}</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{c.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Financial Year", options: fyList, key: "financialYear" },
          { label: "Scheme", options: schemeList, key: "schemeName" },
          { label: "Work", options: workList, key: "name" },
          { label: "Status", options: statusList, key: "status" },
        ].map(f => (
          <div key={f.key} className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{f.label}</label>
            <select className="border border-gray-300 rounded px-3 py-2 text-sm" value={filters[f.key]} onChange={e => setFilters(fs => ({ ...fs, [f.key]: e.target.value }))}>
              {f.options.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <Card className="border border-gray-200 rounded-lg shadow overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">MLA/MLC Fund Demand Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {["Sr", "MLA/MLC Account Name", "IA Name", "Work Title", "Gross Work Order Amount", "Demand Amount", "Status"].map(h => (
                  <th key={h} className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">{idx + 1}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-800">{d.mlaName}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-800">{d.iaName}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-800">{d.name}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-800 text-right">₹{d.adminApprovedAmount.toLocaleString()}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-blue-800 text-right">₹{d.demandAmount.toLocaleString()}</td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-yellow-600 text-left">{d.status}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="border border-gray-200 py-6 text-center text-gray-400 text-sm">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}