
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { UserRecord } from './FundDemand';

interface UserListProps {
  users: UserRecord[];
  onEdit: (user: UserRecord) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, onToggleStatus }) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SNA': return 'bg-red-100 text-red-800';
      case 'DNA': return 'bg-blue-100 text-blue-800';
      case 'IDA': return 'bg-green-100 text-green-800';
      case 'IA': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleFullName = (role: string) => {
    switch (role) {
      case 'SNA': return 'State Nodal Agency';
      case 'DNA': return 'District Nodal Agency';
      case 'IDA': return 'Implementation District Agency';
      case 'IA': return 'Implementation Agency';
      default: return role;
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        <p className="text-sm text-gray-600">Manage all system users and their permissions</p>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {getRoleFullName(user.role)}
                  </div>
                </TableCell>
                <TableCell>{user.district}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {user.isFirstLogin && (
                    <div className="text-xs text-orange-600 mt-1">First Login Pending</div>
                  )}
                </TableCell>
                <TableCell>
                  {user.lastLogin ? (
                    <div>
                      <div className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(user.lastLogin).toLocaleTimeString()}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Never</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8 p-0 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(user.id)}
                      className={`h-8 w-8 p-0 ${
                        user.isActive 
                          ? 'hover:bg-red-50' 
                          : 'hover:bg-green-50'
                      }`}
                    >
                      {user.isActive ? (
                        <UserX className="h-4 w-4 text-red-600" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      )}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {user.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found. Create your first user to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
