
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, FileText, TrendingUp } from 'lucide-react';

interface ReportFilters {
  dateRange: string;
  department: string;
  district: string;
  status: string;
}

interface DepartmentReportsProps {
  filters: ReportFilters;
}

const DepartmentReports: React.FC<DepartmentReportsProps> = ({ filters }) => {
  const departmentPerformance = [
    { dept: 'PWD', projects: 45, completed: 38, budget: 15.75, utilized: 14.2 },
    { dept: 'Health', projects: 32, completed: 28, budget: 11.25, utilized: 10.8 },
    { dept: 'Education', projects: 28, completed: 22, budget: 9.0, utilized: 8.1 },
    { dept: 'Rural Dev', projects: 18, completed: 15, budget: 5.4, utilized: 4.9 },
    { dept: 'Urban Dev', projects: 12, completed: 9, budget: 3.6, utilized: 3.2 }
  ];

  const departmentTrend = [
    { month: 'Jan', PWD: 85, Health: 78, Education: 82 },
    { month: 'Feb', PWD: 88, Health: 82, Education: 79 },
    { month: 'Mar', PWD: 82, Health: 85, Education: 88 },
    { month: 'Apr', PWD: 91, Health: 87, Education: 85 },
    { month: 'May', PWD: 89, Health: 89, Education: 92 },
    { month: 'Jun', PWD: 93, Health: 91, Education: 89 }
  ];

  const chartConfig = {
    projects: {
      label: "Total Projects",
      color: "#2563eb",
    },
    completed: {
      label: "Completed",
      color: "#16a34a",
    },
    budget: {
      label: "Budget (₹ Cr)",
      color: "#dc2626",
    },
  };

  return (
    <div className="space-y-6">
      {/* Department Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">135</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <p className="text-xs text-muted-foreground">Project completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Comparison</CardTitle>
          <CardDescription>Projects and budget utilization by department</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="projects" fill="var(--color-projects)" />
              <Bar dataKey="completed" fill="var(--color-completed)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Department Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Trend</CardTitle>
          <CardDescription>Monthly performance trend for top departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={departmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="PWD" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="Health" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="Education" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Department Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance Details</CardTitle>
          <CardDescription>Comprehensive department-wise breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Department</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Total Projects</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Completed</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Budget (₹ Cr)</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Utilized (₹ Cr)</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Success Rate</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentPerformance.map((dept) => (
                  <tr key={dept.dept}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{dept.dept}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{dept.projects}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{dept.completed}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">₹{dept.budget}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">₹{dept.utilized}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {((dept.completed / dept.projects) * 100).toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <Badge 
                        variant={dept.completed / dept.projects > 0.8 ? "default" : "secondary"}
                      >
                        {dept.completed / dept.projects > 0.8 ? "Excellent" : "Good"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentReports;
