
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

interface ReportFilters {
  dateRange: string;
  department: string;
  district: string;
  status: string;
}

interface FinancialReportsProps {
  filters: ReportFilters;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({ filters }) => {
  const monthlyAllocation = [
    { month: 'Jan', allocated: 4.2, utilized: 3.8, pending: 0.4 },
    { month: 'Feb', allocated: 3.8, utilized: 3.5, pending: 0.3 },
    { month: 'Mar', allocated: 5.1, utilized: 4.2, pending: 0.9 },
    { month: 'Apr', allocated: 4.5, utilized: 4.1, pending: 0.4 },
    { month: 'May', allocated: 6.2, utilized: 5.8, pending: 0.4 },
    { month: 'Jun', allocated: 5.8, utilized: 5.2, pending: 0.6 }
  ];

  const departmentWiseAllocation = [
    { name: 'PWD', value: 35, amount: 15.75 },
    { name: 'Health', value: 25, amount: 11.25 },
    { name: 'Education', value: 20, amount: 9.0 },
    { name: 'Rural Dev', value: 12, amount: 5.4 },
    { name: 'Urban Dev', value: 8, amount: 3.6 }
  ];

  const utilizationTrend = [
    { month: 'Jan', utilization: 78 },
    { month: 'Feb', utilization: 82 },
    { month: 'Mar', utilization: 75 },
    { month: 'Apr', utilization: 88 },
    { month: 'May', utilization: 85 },
    { month: 'Jun', utilization: 92 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartConfig = {
    allocated: {
      label: "Allocated",
      color: "#2563eb",
    },
    utilized: {
      label: "Utilized",
      color: "#16a34a",
    },
    pending: {
      label: "Pending",
      color: "#dc2626",
    },
  };

  return (
    <div className="space-y-6">
      {/* Monthly Fund Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Fund Allocation & Utilization</CardTitle>
          <CardDescription>Comparison of allocated vs utilized funds (₹ Crores)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={monthlyAllocation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="allocated" fill="var(--color-allocated)" />
              <Bar dataKey="utilized" fill="var(--color-utilized)" />
              <Bar dataKey="pending" fill="var(--color-pending)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Fund Allocation</CardTitle>
            <CardDescription>Distribution of funds across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <PieChart>
                <Pie
                  data={departmentWiseAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentWiseAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Fund Utilization Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Fund Utilization Trend</CardTitle>
            <CardDescription>Monthly utilization percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <AreaChart data={utilizationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Detailed breakdown of financial metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Current Month</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Previous Month</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Total Allocation</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹5.8 Cr</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹6.2 Cr</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-red-600">-6.5%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Fund Utilization</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹5.2 Cr</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹5.8 Cr</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-red-600">-10.3%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Pending Amount</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹0.6 Cr</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹0.4 Cr</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-green-600">+50.0%</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Utilization Rate</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">89.7%</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">93.5%</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-red-600">-3.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
