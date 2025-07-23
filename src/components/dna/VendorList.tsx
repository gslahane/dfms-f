
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Vendor } from './VendorVerification';

interface VendorListProps {
  vendors: Vendor[];
  onViewDetails: (vendor: Vendor) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
  onVerify: (vendorId: string, status: 'Verified' | 'Rejected', remarks?: string) => void;
}

const VendorList: React.FC<VendorListProps> = ({
  vendors,
  onViewDetails,
  onEdit,
  onDelete,
  onVerify
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-orange-100 text-orange-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Company':
        return 'bg-blue-100 text-blue-800';
      case 'Partnership':
        return 'bg-purple-100 text-purple-800';
      case 'LLP':
        return 'bg-indigo-100 text-indigo-800';
      case 'Individual':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (vendors.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No vendors found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>GST Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{vendor.name}</div>
                  {vendor.contactPerson && (
                    <div className="text-sm text-gray-500">
                      Contact: {vendor.contactPerson}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getTypeColor(vendor.type)}>
                  {vendor.type}
                </Badge>
              </TableCell>
              <TableCell>{vendor.category}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{vendor.email}</div>
                  <div className="text-gray-500">{vendor.phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-mono text-sm">{vendor.gstNumber}</div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(vendor.verificationStatus)}>
                  {vendor.verificationStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(vendor.registrationDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(vendor)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(vendor)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                    title="Edit Vendor"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {vendor.verificationStatus === 'Pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVerify(vendor.id, 'Verified')}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Verify Vendor"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVerify(vendor.id, 'Rejected', 'Verification rejected')}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Reject Vendor"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this vendor?')) {
                        onDelete(vendor.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete Vendor"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VendorList;
