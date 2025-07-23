
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface MasterDataItem {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

const VendorMasterData = () => {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<{ type: string; item: MasterDataItem | null }>({ type: '', item: null });
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const [categories, setCategories] = useState<MasterDataItem[]>([
    { id: '1', name: 'IT Services', description: 'Information Technology Services', isActive: true },
    { id: '2', name: 'Construction', description: 'Construction and Infrastructure', isActive: true },
    { id: '3', name: 'Supplies', description: 'Office and General Supplies', isActive: true },
    { id: '4', name: 'Consulting', description: 'Professional Consulting Services', isActive: true },
    { id: '5', name: 'Maintenance', description: 'Maintenance and Repair Services', isActive: true },
    { id: '6', name: 'Transport', description: 'Transportation Services', isActive: true },
    { id: '7', name: 'Catering', description: 'Catering and Food Services', isActive: true },
    { id: '8', name: 'Security', description: 'Security Services', isActive: true },
    { id: '9', name: 'Cleaning', description: 'Cleaning and Housekeeping', isActive: true },
    { id: '10', name: 'Equipment Rental', description: 'Equipment Rental Services', isActive: true }
  ]);

  const [documentTypes, setDocumentTypes] = useState<MasterDataItem[]>([
    { id: '1', name: 'GST Certificate', description: 'Goods and Services Tax Certificate', isActive: true },
    { id: '2', name: 'PAN Card', description: 'Permanent Account Number Card', isActive: true },
    { id: '3', name: 'Aadhaar Card', description: 'Aadhaar Identification Card', isActive: true },
    { id: '4', name: 'Bank Statement', description: 'Bank Account Statement', isActive: true },
    { id: '5', name: 'MOA', description: 'Memorandum of Association', isActive: true },
    { id: '6', name: 'AOA', description: 'Articles of Association', isActive: true },
    { id: '7', name: 'Partnership Deed', description: 'Partnership Agreement Document', isActive: true },
    { id: '8', name: 'LLP Agreement', description: 'Limited Liability Partnership Agreement', isActive: true },
    { id: '9', name: 'Trade License', description: 'Trade License Certificate', isActive: true },
    { id: '10', name: 'Professional Tax Certificate', description: 'Professional Tax Registration', isActive: true }
  ]);

  const [vendorTypes, setVendorTypes] = useState<MasterDataItem[]>([
    { id: '1', name: 'Individual', description: 'Individual Vendor/Proprietor', isActive: true },
    { id: '2', name: 'Company', description: 'Private Limited Company', isActive: true },
    { id: '3', name: 'Partnership', description: 'Partnership Firm', isActive: true },
    { id: '4', name: 'LLP', description: 'Limited Liability Partnership', isActive: true }
  ]);

  const handleAddItem = (type: string, items: MasterDataItem[], setItems: React.Dispatch<React.SetStateAction<MasterDataItem[]>>) => {
    if (!newItemName.trim()) return;

    const newItem: MasterDataItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      description: newItemDescription.trim() || undefined,
      isActive: true
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemDescription('');
    
    toast({
      title: "Item Added",
      description: `${newItemName} has been added to ${type}.`,
    });
  };

  const handleEditItem = (type: string, item: MasterDataItem) => {
    setEditingItem({ type, item });
    setNewItemName(item.name);
    setNewItemDescription(item.description || '');
  };

  const handleSaveEdit = (type: string, items: MasterDataItem[], setItems: React.Dispatch<React.SetStateAction<MasterDataItem[]>>) => {
    if (!editingItem.item || !newItemName.trim()) return;

    const updatedItems = items.map(item =>
      item.id === editingItem.item!.id
        ? { ...item, name: newItemName.trim(), description: newItemDescription.trim() || undefined }
        : item
    );

    setItems(updatedItems);
    setEditingItem({ type: '', item: null });
    setNewItemName('');
    setNewItemDescription('');

    toast({
      title: "Item Updated",
      description: `${newItemName} has been updated.`,
    });
  };

  const handleDeleteItem = (type: string, itemId: string, items: MasterDataItem[], setItems: React.Dispatch<React.SetStateAction<MasterDataItem[]>>) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setItems(items.filter(i => i.id !== itemId));
      toast({
        title: "Item Deleted",
        description: `${item.name} has been removed.`,
        variant: "destructive"
      });
    }
  };

  const toggleItemStatus = (itemId: string, items: MasterDataItem[], setItems: React.Dispatch<React.SetStateAction<MasterDataItem[]>>) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, isActive: !item.isActive } : item
    );
    setItems(updatedItems);
  };

  const renderMasterDataTable = (
    title: string,
    type: string,
    items: MasterDataItem[],
    setItems: React.Dispatch<React.SetStateAction<MasterDataItem[]>>
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Manage {title.toLowerCase()} used in vendor registration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Item Form */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`${type}-name`}>Name</Label>
              <Input
                id={`${type}-name`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor={`${type}-description`}>Description</Label>
              <Input
                id={`${type}-description`}
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter description (optional)"
              />
            </div>
            <div className="flex items-end">
              {editingItem.type === type && editingItem.item ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleSaveEdit(type, items, setItems)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingItem({ type: '', item: null });
                      setNewItemName('');
                      setNewItemDescription('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleAddItem(type, items, setItems)}
                  className="bg-[#193A9A] hover:bg-[#142f7c] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleItemStatus(item.id, items, setItems)}
                  className={item.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                >
                  {item.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditItem(type, item)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(type, item.id, items, setItems)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="documents">Document Types</TabsTrigger>
          <TabsTrigger value="types">Vendor Types</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {renderMasterDataTable('Vendor Categories', 'categories', categories, setCategories)}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {renderMasterDataTable('Document Types', 'documents', documentTypes, setDocumentTypes)}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          {renderMasterDataTable('Vendor Types', 'types', vendorTypes, setVendorTypes)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorMasterData;
