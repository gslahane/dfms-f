
import React, { useState } from 'react';
import { Search, Edit, Trash2, MoreHorizontal, Eye, Power } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DepartmentRecord } from './DepartmentManagement';

interface DepartmentListProps {
  departments: DepartmentRecord[];
  onEdit: (department: DepartmentRecord) => void;
  onDelete: (departmentId: string) => void;
  onToggleStatus: (departmentId: string) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentRecord | null>(null);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">District List</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Districts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>District</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Head</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{department.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{department.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {department.code}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{department.headName}</div>
                    <div className="text-sm text-gray-500">{department.headEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-900">{department.district}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{department.totalUsers}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{department.totalProjects}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatCurrency(department.totalBudget)}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={department.isActive ? "default" : "secondary"}
                    className={department.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {department.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedDepartment(department)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(department)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(department.id)}>
                        <Power className="mr-2 h-4 w-4" />
                        {department.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Department</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{department.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(department.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No departments found matching your search.</p>
        </div>
      )}

      {/* Department Details Dialog */}
      {selectedDepartment && (
        <AlertDialog open={!!selectedDepartment} onOpenChange={() => setSelectedDepartment(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedDepartment.name} Details</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Code:</strong> {selectedDepartment.code}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <Badge className={`ml-2 ${selectedDepartment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedDepartment.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <strong>District:</strong> {selectedDepartment.district}
                </div>
                <div>
                  <strong>Created:</strong> {selectedDepartment.createdAt}
                </div>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-gray-600">{selectedDepartment.description}</p>
              </div>
              <div>
                <strong>Address:</strong>
                <p className="mt-1 text-gray-600">{selectedDepartment.address}</p>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Department Head</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Name:</strong> {selectedDepartment.headName}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {selectedDepartment.headMobile}
                  </div>
                  <div className="col-span-2">
                    <strong>Email:</strong> {selectedDepartment.headEmail}
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <strong>Total Users:</strong> {selectedDepartment.totalUsers}
                  </div>
                  <div>
                    <strong>Total Projects:</strong> {selectedDepartment.totalProjects}
                  </div>
                  <div>
                    <strong>Total Budget:</strong> {formatCurrency(selectedDepartment.totalBudget)}
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default DepartmentList;
