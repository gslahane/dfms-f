
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, RefreshCw } from 'lucide-react';

interface ReportFilters {
  dateRange: string;
  department: string;
  district: string;
  status: string;
}

interface ReportFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: 'last30days',
      department: 'all',
      district: 'all',
      status: 'all'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last3months">Last 3 Months</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="PWD">Public Works Department</SelectItem>
                <SelectItem value="HEALTH">Health Department</SelectItem>
                <SelectItem value="EDUCATION">Education Department</SelectItem>
                <SelectItem value="RURAL">Rural Development</SelectItem>
                <SelectItem value="URBAN">Urban Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">District</label>
            <Select value={filters.district} onValueChange={(value) => handleFilterChange('district', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="nagpur">Nagpur</SelectItem>
                <SelectItem value="nashik">Nashik</SelectItem>
                <SelectItem value="aurangabad">Aurangabad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={resetFilters} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
