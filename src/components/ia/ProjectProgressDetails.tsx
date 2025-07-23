
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  User, 
  IndianRupee, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { ProjectProgressData } from './ProjectProgressList';

interface ProjectProgressDetailsProps {
  project: ProjectProgressData;
  formatCurrency: (amount: string) => string;
}

const ProjectProgressDetails: React.FC<ProjectProgressDetailsProps> = ({
  project,
  formatCurrency
}) => {
  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Delayed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Pending': return <Target className="h-4 w-4 text-gray-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Project Name</label>
              <p className="text-sm mt-1">{project.projectName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Project Code</label>
              <p className="text-sm mt-1">{project.projectCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Department</label>
                <p className="text-sm mt-1">{project.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-sm mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {project.location}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Project Manager</label>
              <p className="text-sm mt-1">{project.projectManager}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-sm mt-1">{new Date(project.startDate).toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Expected Completion</label>
              <p className="text-sm mt-1">{new Date(project.expectedCompletion).toLocaleDateString('en-IN')}</p>
            </div>
            {project.actualCompletion && (
              <div>
                <label className="text-sm font-medium text-gray-500">Actual Completion</label>
                <p className="text-sm mt-1">{new Date(project.actualCompletion).toLocaleDateString('en-IN')}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge className={`${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                  project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold">{project.overallProgress}%</span>
              </div>
              <Progress value={parseInt(project.overallProgress)} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Physical Progress</span>
                <span className="text-sm font-bold">{project.physicalProgress}%</span>
              </div>
              <Progress value={parseInt(project.physicalProgress)} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Financial Progress</span>
                <span className="text-sm font-bold">{project.financialProgress}%</span>
              </div>
              <Progress value={parseInt(project.financialProgress)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Budget Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Allocated Budget</p>
              <p className="text-2xl font-bold text-blue-600">₹{formatCurrency(project.budget.allocated)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Utilized Budget</p>
              <p className="text-2xl font-bold text-green-600">₹{formatCurrency(project.budget.utilized)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Remaining Budget</p>
              <p className="text-2xl font-bold text-orange-600">₹{formatCurrency(project.budget.remaining)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getMilestoneIcon(milestone.status)}
                  <div>
                    <p className="font-medium">{milestone.name}</p>
                    <p className="text-sm text-gray-600">
                      Target: {new Date(milestone.targetDate).toLocaleDateString('en-IN')}
                      {milestone.actualDate && (
                        <span className="ml-2">
                          | Actual: {new Date(milestone.actualDate).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Badge className={getMilestoneStatusColor(milestone.status)}>
                  {milestone.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues and Next Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Current Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.issues.length > 0 ? (
              <ul className="space-y-2">
                {project.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No current issues reported</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Next Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.nextActions.length > 0 ? (
              <ul className="space-y-2">
                {project.nextActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No next actions defined</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Update Information */}
      <div className="text-sm text-gray-600">
        <p>Last updated on {new Date(project.lastUpdated).toLocaleDateString('en-IN')} by {project.updatedBy}</p>
      </div>
    </div>
  );
};

export default ProjectProgressDetails;
