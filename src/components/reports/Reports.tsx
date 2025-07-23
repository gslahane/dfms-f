
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import FinancialReports from './FinancialReports';
import DepartmentReports from './DepartmentReports';
import ProjectReports from './ProjectReports';
import ReportFilters from './ReportFilters';

interface FilterState {
  dateRange: string;
  department: string;
  district: string;
  status: string;
}

const Reports = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'last30days',
    department: 'all',
    district: 'all',
    status: 'all'
  });

  const handleExportReport = (type: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${type}`);
    // Implementation for export functionality
  };

  const summaryStats = [
    {
      title: 'Total Fund Allocation',
      value: '₹45.2 Cr',
      change: '+12.3%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Active works',
      value: '128',
      change: '+5.2%',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Departments',
      value: '24',
      change: '0%',
      icon: BarChart3,
      color: 'text-purple-600'
    },
    {
      title: 'Fund Utilization',
      value: '78.5%',
      change: '+3.1%',
      icon: PieChart,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial and operational insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReportFilters filters={filters} onFiltersChange={setFilters} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color} mt-1`}>
                {stat.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
          <TabsTrigger value="department">Department Reports</TabsTrigger>
          <TabsTrigger value="project">work Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <FinancialReports filters={filters} />
        </TabsContent>

        <TabsContent value="department">
          <DepartmentReports filters={filters} />
        </TabsContent>

        <TabsContent value="project">
          <ProjectReports filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
