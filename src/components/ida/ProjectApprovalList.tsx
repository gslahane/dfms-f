
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Eye, Trash2, Search, Filter, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import ProjectApprovalDetails from './ProjectApprovalDetails';
import ProjectApprovalForm from './ProjectApprovalForm';

const ProjectApprovalList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Mock data
  const projects = [
    {
      id: 1,
      projectCode: 'PRJ-2024-001',
      projectName: 'Rural Road Development Phase-II',
      department: 'Public Works',
      projectType: 'Infrastructure',
      priority: 'High',
      budget: 50000000,
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      status: 'Under Review',
      submittedBy: 'Rajesh Kumar',
      submittedDate: '2024-01-15',
      description: 'Development of rural roads connecting remote villages',
      currentStage: 'Technical Review'
    },
    {
      id: 2,
      projectCode: 'PRJ-2024-002',
      projectName: 'Digital Education Initiative',
      department: 'Education',
      projectType: 'Technology',
      priority: 'Medium',
      budget: 25000000,
      startDate: '2024-03-01',
      endDate: '2024-11-30',
      status: 'Approved',
      submittedBy: 'Priya Sharma',
      submittedDate: '2024-01-10',
      description: 'Implementation of digital learning platforms in schools',
      currentStage: 'Implementation'
    },
    {
      id: 3,
      projectCode: 'PRJ-2024-003',
      projectName: 'Primary Healthcare Centers Upgrade',
      department: 'Health',
      projectType: 'Infrastructure',
      priority: 'High',
      budget: 75000000,
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Pending',
      submittedBy: 'Dr. Amit Patel',
      submittedDate: '2024-01-20',
      description: 'Modernization of existing PHCs with new equipment',
      currentStage: 'Initial Review'
    },
    {
      id: 4,
      projectCode: 'PRJ-2024-004',
      projectName: 'Skill Development Program',
      department: 'Rural Development',
      projectType: 'Development',
      priority: 'Medium',
      budget: 15000000,
      startDate: '2024-05-01',
      endDate: '2024-10-31',
      status: 'Rejected',
      submittedBy: 'Sunita Reddy',
      submittedDate: '2024-01-18',
      description: 'Training programs for rural youth skill development',
      currentStage: 'Closed'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { variant: 'secondary' as const, icon: Clock },
      'Under Review': { variant: 'default' as const, icon: AlertCircle },
      'Approved': { variant: 'default' as const, icon: CheckCircle },
      'Rejected': { variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'High': 'destructive' as const,
      'Medium': 'default' as const,
      'Low': 'secondary' as const
    };

    return (
      <Badge variant={priorityConfig[priority as keyof typeof priorityConfig] || 'secondary'}>
        {priority}
      </Badge>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDepartment = departmentFilter === 'all' || project.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleView = (project: any) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setShowEditForm(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete project:', id);
  };

  if (showDetails && selectedProject) {
    return (
      <ProjectApprovalDetails 
        project={selectedProject}
        onBack={() => {
          setShowDetails(false);
          setSelectedProject(null);
        }}
      />
    );
  }

  if (showEditForm && selectedProject) {
    return (
      <ProjectApprovalForm 
        project={selectedProject}
        onCancel={() => {
          setShowEditForm(false);
          setSelectedProject(null);
        }}
        onSubmit={() => {
          setShowEditForm(false);
          setSelectedProject(null);
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Approval List</CardTitle>
        <CardDescription>Manage and track all project approval requests</CardDescription>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Public Works">Public Works</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Rural Development">Rural Development</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Code</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.projectCode}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48">
                      <p className="font-medium truncate" title={project.projectName}>
                        {project.projectName}
                      </p>
                      <p className="text-sm text-gray-500 truncate" title={project.description}>
                        {project.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{project.department}</TableCell>
                  <TableCell>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {project.projectType}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(project.priority)}
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-semibold">
                      ₹{(project.budget / 1000000).toFixed(1)}M
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{project.submittedBy}</p>
                      <p className="text-sm text-gray-500">{project.submittedDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(project.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {project.currentStage}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleView(project)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No projects found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectApprovalList;
