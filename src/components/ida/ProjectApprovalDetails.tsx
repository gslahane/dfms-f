
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, DollarSign, User, Building, Target, AlertTriangle, TrendingUp } from 'lucide-react';

interface ProjectApprovalDetailsProps {
  project: any;
  onBack: () => void;
}

const ProjectApprovalDetails: React.FC<ProjectApprovalDetailsProps> = ({ project, onBack }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'Under Review': { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'Approved': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'Rejected': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'High': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      'Medium': { variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
      'Low': { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['Medium'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{project.projectName}</h1>
          <p className="text-gray-600">{project.projectCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{project.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Objectives</h4>
                <p className="text-gray-700">{project.objectives || 'To develop and improve rural infrastructure connectivity, enhancing accessibility and economic opportunities for rural communities.'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Target Beneficiaries</h4>
                <p className="text-gray-700">{project.beneficiaries || 'Rural communities in 25 villages, approximately 50,000 direct beneficiaries including farmers, students, and local businesses.'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Implementation Plan</h4>
                <p className="text-gray-700">{project.implementationPlan || 'Phase-wise implementation over 11 months including site surveys, contractor selection, construction, and quality assurance.'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Risk Assessment</h4>
                <p className="text-gray-700">{project.riskAssessment || 'Weather-related delays, land acquisition challenges, and material cost fluctuations. Mitigation strategies include buffer time and alternative suppliers.'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Expected Outcomes</h4>
                <p className="text-gray-700">{project.expectedOutcome || 'Improved connectivity, reduced travel time by 40%, increased agricultural productivity, and enhanced access to education and healthcare facilities.'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Approval History */}
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Submitted for Review</p>
                    <p className="text-sm text-gray-600">by {project.submittedBy} on {project.submittedDate}</p>
                    <p className="text-sm text-gray-500">Initial project proposal submitted</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">Technical Review Started</p>
                    <p className="text-sm text-gray-600">by Technical Team on 2024-01-18</p>
                    <p className="text-sm text-gray-500">Project under technical evaluation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-500">Financial Review - Pending</p>
                    <p className="text-sm text-gray-500">Awaiting financial committee review</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(project.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Priority:</span>
                {getPriorityBadge(project.priority)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Stage:</span>
                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {project.currentStage}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-gray-600">{project.department}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Project Type</p>
                  <p className="text-sm text-gray-600">{project.projectType}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Total Budget</p>
                  <p className="text-sm text-green-600 font-semibold">
                    ₹{project.budget.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Timeline</p>
                  <p className="text-sm text-gray-600">
                    {project.startDate} to {project.endDate}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Submitted By</p>
                  <p className="text-sm text-gray-600">{project.submittedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default">
                Approve Project
              </Button>
              <Button className="w-full" variant="outline">
                Request Modifications
              </Button>
              <Button className="w-full" variant="destructive">
                Reject Project
              </Button>
              <Button className="w-full" variant="outline">
                Add Comments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectApprovalDetails;
