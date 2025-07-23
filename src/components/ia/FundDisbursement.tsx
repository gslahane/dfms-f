import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FilePlus2 } from "lucide-react";
import FundDemandForm from "./FundDemandForm";
import FundDemandDetails from "./FundDemandDetails";



// Dummy Data
const dummyWorks = [
  {
    id: 468,
    workCode: "ML/2425/2151",
    name: "ML/2425/2151 जांबूत येथे जांबूत चोंभूत रोड ते कळमजाई मंदिर रस्ता करणे ता.शिरुर",
    district: "Pune",
    constituency: "Shirur",
    mlaName: "Dnyaneshwar Katke",
    schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
    iaName: "928 Executive Engineer, Public Works North Division, Pune",
    financialYear: "2024-25",
    demandAmount: 1400,
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
    schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME",
    iaName: "1189 District Sports Officer, Pune",
    financialYear: "2024-25",
    demandAmount: 1990,
    adminApprovedAmount: 1990,
    workPortionAmount: 1800,
    taxDeductionAmount: 100,
    vendor: {
      id: "1189",
      name: "Sadguru Infrastructure Ltd.",
      aadhar: "456789123456",
    },
  },
];

const dummyDemands = [
  // For workId 468
  {
    id: "MLD-468-1",
    workId: 468,
    amount: 500,
    netPayable: 480,
    status: "Pending",
    remarks: "First Installment",
    date: "2024-07-01",
  },
  {
    id: "MLD-468-2",
    workId: 468,
    amount: 400,
    netPayable: 380,
    status: "Approved",
    remarks: "Second Installment",
    date: "2024-08-01",
  },

  // For workId 469
  {
    id: "MLD-469-1",
    workId: 469,
    amount: 1000,
    netPayable: 950,
    status: "Pending",
    remarks: "First Installment",
    date: "2024-07-05",
  },
  {
    id: "MLD-469-2",
    workId: 469,
    amount: 500,
    netPayable: 480,
    status: "Approved",
    remarks: "Second Installment",
    date: "2024-08-10",
  },
];

const statusSymbol: Record<string, string> = {
  Approved: "✔️",
  Pending: "⏳",
  Rejected: "❌",
};
// Badge for status
const getStatusBadge = (status: string) => (
  <Badge
    variant={
      status === "Approved"
        ? "default"
        : status === "Pending"
        ? "secondary"
        : status === "Rejected"
        ? "destructive"
        : "secondary"
    }
  >
    {status}
  </Badge>
);

const FundDemand = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [works] = useState(dummyWorks);
  const [demands, setDemands] = useState(dummyDemands);

  // Filters
  const [fy, setFy] = useState<string>("all");
  const [scheme, setScheme] = useState<string>("all");
  const [work, setWork] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  // For popups
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [selectedDemand, setSelectedDemand] = useState<any>(null);

  const addDemand = (demand: any) => setDemands([...demands, demand]);

  // Get filter values
  const fyList = useMemo(
    () => ["all", ...Array.from(new Set(works.map((w) => w.financialYear)))],
    [works]
  );
  const schemeList = useMemo(
    () =>
      fy === "all"
        ? ["all", ...Array.from(new Set(works.map((w) => w.scheme)))]
        : [
            "all",
            ...Array.from(
              new Set(
                works.filter((w) => w.financialYear === fy).map((w) => w.scheme)
              )
            ),
          ],
    [works, fy]
  );
  const workList = useMemo(
    () =>
      scheme === "all"
        ? [
            "all",
            ...Array.from(
              new Set(
                works
                  .filter((w) => fy === "all" || w.financialYear === fy)
                  .map((w) => w.name)
              )
            ),
          ]
        : [
            "all",
            ...Array.from(
              new Set(
                works.filter((w) => w.scheme === scheme).map((w) => w.name)
              )
            ),
          ],
    [works, fy, scheme]
  );

  // Filtered Works
  const filteredWorks = works.filter(
    (w) =>
      (fy === "all" || w.financialYear === fy) &&
      (scheme === "all" || w.scheme === scheme) &&
      (work === "all" || w.name === work)
  );

  // Filtered Demands
  const filteredDemands = demands.filter((d) => {
    const workObj = works.find((w) => w.id === d.workId);
    return (
      (fy === "all" || workObj?.financialYear === fy) &&
      (scheme === "all" || workObj?.scheme === scheme) &&
      (work === "all" || workObj?.name === work) &&
      (status === "all" || d.status === status)
    );
  });

  // Stats
  const stats = {
    totalWorks: filteredWorks.length,
    totalVendors: [...new Set(filteredWorks.map((w) => w.vendor))].length,
    totalLimit: filteredWorks.reduce((acc, w) => acc + (w.limit ?? 0), 0),
    pendingDemands: filteredDemands.filter((d) => d.status === "Pending")
      .length,
    approvedDemands: filteredDemands.filter((d) => d.status === "Approved")
      .length,
    totalDemandAmount: filteredDemands.reduce(
      (acc, d) => acc + (d.amount ?? 0),
      0
    ),
    totalDemandApproved: filteredDemands
      .filter((d) => d.status === "Approved")
      .reduce((acc, d) => acc + (d.amount ?? 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Demand Form Modal */}
      <FundDemandForm
        open={showForm}
        onClose={() => setShowForm(false)}
        work={selectedWork}
        demands={demands}
        addDemand={addDemand}
      />

      {/* Demand Details Modal */}
      <FundDemandDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        demand={selectedDemand}
        work={selectedWork}
        vendor={selectedWork?.vendor} // ✅ Correct
        demands={demands}
      />

      {/* FILTERS */}
      <div className="flex flex-wrap items-end gap-3 pb-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600">
            Financial Year
          </label>
          <select
            value={fy}
            onChange={(e) => {
              setFy(e.target.value);
              setScheme("all");
              setWork("all");
            }}
            className="block px-3 py-1.5 mt-1 border rounded-md w-40"
          >
            {fyList.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "All" : opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600">
            Scheme
          </label>
          <select
            value={scheme}
            onChange={(e) => {
              setScheme(e.target.value);
              setWork("all");
            }}
            className="block px-3 py-1.5 mt-1 border rounded-md w-40"
          >
            {schemeList.map((opt, index) => (
              <option key={`scheme-${opt}-${index}`} value={opt}>
                {opt === "all" ? "All" : opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600">
            Work
          </label>
          <select
            value={work}
            onChange={(e) => setWork(e.target.value)}
            className="block px-3 py-1.5 mt-1 border rounded-md w-48"
          >
            {workList.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all" ? "All" : opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block px-3 py-1.5 mt-1 border rounded-md w-32"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          {
            label: "Total Works",
            value: stats.totalWorks,
            desc: "Works under selected filters",
          },
          // {
          //   label: "Vendors Assigned",
          //   value: stats.totalVendors,
          //   desc: "Vendors mapped",
          // },
          // {
          //   label: "Total Limit",
          //   value: `₹${(stats.totalLimit ?? 0).toLocaleString()}`,
          //   desc: "Works limit (filtered)",
          // },
          {
            label: "Total Demand Amount",
            value: `₹${(stats.totalDemandAmount ?? 0).toLocaleString()}`,
            desc: "Sum of all demands",
          },
          {
            label: "Approved Demand Amount",
            value: `₹${(stats.totalDemandApproved ?? 0).toLocaleString()}`,
            desc: "Sum of approved demands",
          },
          {
            label: " No of Pending Demands",
            value: stats.pendingDemands,
            desc: "Awaiting approval",
          },
        ].map((card, i) => (
          <Card
            key={i}
            className="h-full flex flex-col justify-between rounded-2xl shadow border border-gray-200 bg-white transition hover:shadow-lg"
          >
            <CardHeader className="pb-0 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold tracking-wide text-gray-700">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center py-3">
              <div className="text-2xl font-extrabold text-primary mb-1">
                {card.value}
              </div>
              <div className="text-xs text-muted-foreground">{card.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Sanctioned Works</TabsTrigger>
          <TabsTrigger value="pending">Pending Demands</TabsTrigger>
          <TabsTrigger value="approved">Approved Demands</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    MLA/MLC Account Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    IA Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Work Title
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Gross Work Order Amount
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Funds disbursed so far
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Demand Amount
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredWorks.map((work, idx) => {
                  const workDemands = demands.filter(
                    (d) => d.workId === work.id
                  );
                  const totalDemanded = workDemands.reduce(
                    (acc, d) => acc + (d.amount ?? 0),
                    0
                  );
                  const grossTotal =
                    (work.workPortionAmount ?? 0) +
                    (work.taxDeductionAmount ?? 0);
                  const balanceAmount = grossTotal - totalDemanded;

                  return (
                    <tr
                      key={work.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-primary/5 transition border-b last:border-0`}
                    >
                      <td className="px-4 py-2">{work.mlaName}</td>
                      <td className="px-4 py-2">{work.iaName}</td>
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {work.name}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ₹{(grossTotal ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ₹{(totalDemanded ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ₹{(work.demandAmount ?? 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            work.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : work.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                          aria-label={work.status}
                        >
                          {statusSymbol[work.status] || "❔"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedWork(work);
                              setShowForm(true);
                            }}
                            className="w-full"
                          >
                            <FilePlus2 className="w-4 h-4 mr-1" /> Demand
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const demand = workDemands.slice(-1)[0];
                              setSelectedDemand(demand || null);
                              setSelectedWork(work);
                              setShowDetails(true);
                            }}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredWorks.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-400 py-6">
                      No works match the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Pending Demands */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Demands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Demand ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Work Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDemands
                      .filter((d) => d.status === "Pending")
                      .map((demand, idx) => {
                        const workObj = works.find(
                          (w) => w.id === demand.workId
                        );
                        return (
                          <tr
                            key={demand.id}
                            className={`${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-primary/5 transition border-b last:border-0`}
                          >
                            <td className="px-4 py-2 font-medium text-gray-900">
                              {demand.id}
                            </td>
                            <td className="px-4 py-2">
                              {workObj?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {workObj?.vendor?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-right">
                              ₹{(demand.amount ?? 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {getStatusBadge(demand.status)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDemand(demand);
                                  setSelectedWork(workObj);
                                  setShowDetails(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    {filteredDemands.filter((d) => d.status === "Pending")
                      .length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center text-gray-400 py-6"
                        >
                          No pending demands
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Demands */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Demands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Demand ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Work Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Vendor
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDemands
                      .filter((d) => d.status === "Approved")
                      .map((demand, idx) => {
                        const workObj = works.find(
                          (w) => w.id === demand.workId
                        );
                        return (
                          <tr
                            key={demand.id}
                            className={`${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-primary/5 transition border-b last:border-0`}
                          >
                            <td className="px-4 py-2 font-medium text-gray-900">
                              {demand.id}
                            </td>
                            <td className="px-4 py-2">
                              {workObj?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2">
                              {workObj?.vendor?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-right">
                              ₹{(demand.amount ?? 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {getStatusBadge(demand.status)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDemand(demand);
                                  setSelectedWork(workObj);
                                  setShowDetails(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    {filteredDemands.filter((d) => d.status === "Approved")
                      .length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center text-gray-400 py-6"
                        >
                          No approved demands
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundDemand;