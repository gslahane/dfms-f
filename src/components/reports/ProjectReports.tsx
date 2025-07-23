
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ReportFilters {
  dateRange: string;
  department: string;
  district: string;
  status: string;
}

interface ProjectReportsProps {
  filters: ReportFilters;
}

const ProjectReports: React.FC<ProjectReportsProps> = ({ filters }) => {
  const projectStatusData = [
    { name: 'Completed', value: 45, count: 45 },
    { name: 'In Progress', value: 35, count: 35 },
    { name: 'Pending', value: 15, count: 15 },
    { name: 'Cancelled', value: 5, count: 5 }
  ];

  const monthlyProjectCompletion = [
    { month: 'Jan', completed: 8, started: 12, cancelled: 1 },
    { month: 'Feb', completed: 12, started: 10, cancelled: 0 },
    { month: 'Mar', completed: 15, started: 18, cancelled: 2 },
    { month: 'Apr', completed: 10, started: 8, cancelled: 1 },
    { month: 'May', completed: 18, started: 15, cancelled: 0 },
    { month: 'Jun', completed: 14, started: 12, cancelled: 1 }
  ];

  const projectsByCategory = [
    { category: 'Infrastructure', count: 32, budget: 18.5, progress: 78 },
    { category: 'Healthcare', count: 28, budget: 12.3, progress: 85 },
    { category: 'Education', count: 24, budget: 9.8, progress: 82 },
    { category: 'Agriculture', count: 18, budget: 7.2, progress: 75 },
    { category: 'Technology', count: 15, budget: 5.4, progress: 88 }
  ];

  const recentProjects = [
    {
      id: 'MH-2024-001',
      name: 'Rural Road Development Phase 2',
      department: 'PWD',
      budget: 2.5,
      progress: 85,
      status: 'In Progress',
      startDate: '2024-01-15',
      expectedCompletion: '2024-08-30'
    },
    {
      id: 'MH-2024-002',
      name: 'Primary Health Center Upgrade',
      department: 'Health',
      budget: 1.8,
      progress: 95,
      status: 'Nearly Complete',
      startDate: '2024-02-01',
      expectedCompletion: '2024-07-15'
    },
    {
      id: 'MH-2024-003',
      name: 'Digital Classroom Initiative',
      department: 'Education',
      budget: 3.2,
      progress: 60,
      status: 'In Progress',
      startDate: '2024-03-10',
      expectedCompletion: '2024-12-20'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const chartConfig = {
    completed: {
      label: "Completed",
      color: "#16a34a",
    },
    started: {
      label: "Started",
      color: "#2563eb",
    },
    cancelled: {
      label: "Cancelled",
      color: "#dc2626",
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Nearly Complete':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Works</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">All time Works</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Active Works</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Behind schedule</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Project Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Project Activity</CardTitle>
            <CardDescription>Project starts and completions by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <AreaChart data={monthlyProjectCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="var(--color-completed)"
                  fill="var(--color-completed)"
                />
                <Area
                  type="monotone"
                  dataKey="started"
                  stackId="1"
                  stroke="var(--color-started)"
                  fill="var(--color-started)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projects by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Projects by Category</CardTitle>
          <CardDescription>Project distribution and progress by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectsByCategory.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{category.category}</h4>
                    <span className="text-sm text-gray-600">{category.count} projects</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Budget: ₹{category.budget} Cr</span>
                    <span className="text-sm font-medium">{category.progress}%</span>
                  </div>
                  <Progress value={category.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest project updates and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Project ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Department</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Budget</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Progress</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Expected Completion</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{project.id}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="font-medium">{project.name}</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{project.department}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">₹{project.budget} Cr</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="flex-1 h-2" />
                        <span className="text-sm">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <Badge variant={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                      {new Date(project.expectedCompletion).toLocaleDateString('en-IN')}
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

export default ProjectReports;
