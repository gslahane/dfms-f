
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Eye, Edit, Calendar, MapPin, User, FileText } from 'lucide-react';
import ProjectProgressDetails from './ProjectProgressDetails';

export interface ProjectProgressData {
  id: string;
  projectName: string;
  projectCode: string;
  department: string;
  location: string;
  projectManager: string;
  startDate: string;
  expectedCompletion: string;
  actualCompletion?: string;
  overallProgress: string;
  physicalProgress: string;
  financialProgress: string;
  status: 'On Track' | 'Delayed' | 'At Risk' | 'Completed' | 'On Hold';
  milestones: {
    name: string;
    targetDate: string;
    actualDate?: string;
    status: 'Completed' | 'In Progress' | 'Pending' | 'Delayed';
  }[];
  budget: {
    allocated: string;
    utilized: string;
    remaining: string;
  };
  lastUpdated: string;
  updatedBy: string;
  issues: string[];
  nextActions: string[];
}

const ProjectProgressList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectProgressData | null>(null);

  // Mock data
  const progressData: ProjectProgressData[] = [
    {
      id: 'PRJ001',
      projectName: 'Digital Infrastructure Development',
      projectCode: 'DID-2024-001',
      department: 'Information Technology',
      location: 'Mumbai',
      projectManager: 'Rajesh Kumar',
      startDate: '2024-01-15',
      expectedCompletion: '2024-12-31',
      overallProgress: '65',
      physicalProgress: '60',
      financialProgress: '70',
      status: 'On Track',
      milestones: [
        { name: 'Phase 1 - Planning', targetDate: '2024-03-15', actualDate: '2024-03-10', status: 'Completed' },
        { name: 'Phase 2 - Implementation', targetDate: '2024-09-30', status: 'In Progress' },
        { name: 'Phase 3 - Testing', targetDate: '2024-11-30', status: 'Pending' }
      ],
      budget: {
        allocated: '50000000',
        utilized: '35000000',
        remaining: '15000000'
      },
      lastUpdated: '2024-01-15',
      updatedBy: 'Priya Sharma',
      issues: ['Network connectivity issues in rural areas'],
      nextActions: ['Complete fiber optic installation', 'Conduct user training sessions']
    },
    {
      id: 'PRJ002',
      projectName: 'Rural Healthcare Network',
      projectCode: 'RHN-2024-002',
      department: 'Health',
      location: 'Pune',
      projectManager: 'Dr. Anjali Patil',
      startDate: '2024-02-01',
      expectedCompletion: '2024-10-31',
      overallProgress: '45',
      physicalProgress: '50',
      financialProgress: '40',
      status: 'Delayed',
      milestones: [
        { name: 'Site Survey', targetDate: '2024-03-01', actualDate: '2024-03-05', status: 'Completed' },
        { name: 'Equipment Procurement', targetDate: '2024-06-30', status: 'Delayed' },
        { name: 'Installation', targetDate: '2024-08-31', status: 'Pending' }
      ],
      budget: {
        allocated: '25000000',
        utilized: '10000000',
        remaining: '15000000'
      },
      lastUpdated: '2024-01-14',
      updatedBy: 'Suresh Joshi',
      issues: ['Delayed equipment delivery', 'Staff shortage'],
      nextActions: ['Follow up with vendors', 'Recruit additional staff']
    }
  ];

  const filteredData = progressData.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN').format(parseInt(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'On Track': return 'bg-blue-100 text-blue-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage: string) => {
    const pct = parseFloat(percentage);
    if (pct >= 80) return 'text-green-600';
    if (pct >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Progress Overview</CardTitle>
          <CardDescription>Monitor implementation progress of all active projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by project name, code, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Details</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Budget Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.projectName}</div>
                        <div className="text-sm text-gray-500">{project.projectCode}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{project.location}</span>
                          <User className="h-3 w-3 text-gray-400 ml-2" />
                          <span className="text-xs text-gray-600">{project.projectManager}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Overall:</span>
                          <span className={`font-medium ${getProgressColor(project.overallProgress)}`}>
                            {project.overallProgress}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Physical:</span>
                          <span className={`font-medium ${getProgressColor(project.physicalProgress)}`}>
                            {project.physicalProgress}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Financial:</span>
                          <span className={`font-medium ${getProgressColor(project.financialProgress)}`}>
                            {project.financialProgress}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(project.startDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Target: {new Date(project.expectedCompletion).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Utilized: ₹{formatCurrency(project.budget.utilized)}</div>
                        <div className="text-gray-600">
                          of ₹{formatCurrency(project.budget.allocated)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(project.lastUpdated).toLocaleDateString('en-IN')}</div>
                        <div className="text-gray-600">by {project.updatedBy}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedProject(project)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Project Progress Details</DialogTitle>
                              <DialogDescription>
                                Detailed progress information for {project.projectName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProject && (
                              <ProjectProgressDetails 
                                project={selectedProject} 
                                formatCurrency={formatCurrency}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectProgressList;
