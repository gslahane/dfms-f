
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, MapPin, Building2, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MasterDataSettings = () => {
  const [districts, setDistricts] = useState([
    { id: 1, name: 'Mumbai', code: 'MUM', description: 'Mumbai District' },
    { id: 2, name: 'Pune', code: 'PUN', description: 'Pune District' },
    { id: 3, name: 'Nashik', code: 'NAS', description: 'Nashik District' },
  ]);

  const [schemes, setSchemes] = useState([
    { id: 1, name: 'Rural Development Scheme', code: 'RDS', description: 'Scheme for rural area development' },
    { id: 2, name: 'Urban Infrastructure', code: 'UIS', description: 'Urban infrastructure improvement' },
    { id: 3, name: 'Education Enhancement', code: 'EES', description: 'Education system enhancement' },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Infrastructure', code: 'INF', description: 'Infrastructure projects' },
    { id: 2, name: 'Social Welfare', code: 'SWF', description: 'Social welfare programs' },
    { id: 3, name: 'Healthcare', code: 'HCR', description: 'Healthcare initiatives' },
  ]);

  const [newDistrict, setNewDistrict] = useState({ name: '', code: '', description: '' });
  const [newScheme, setNewScheme] = useState({ name: '', code: '', description: '' });
  const [newCategory, setNewCategory] = useState({ name: '', code: '', description: '' });

  const handleAddDistrict = () => {
    if (newDistrict.name && newDistrict.code) {
      setDistricts([...districts, { 
        id: Date.now(), 
        ...newDistrict 
      }]);
      setNewDistrict({ name: '', code: '', description: '' });
    }
  };

  const handleAddScheme = () => {
    if (newScheme.name && newScheme.code) {
      setSchemes([...schemes, { 
        id: Date.now(), 
        ...newScheme 
      }]);
      setNewScheme({ name: '', code: '', description: '' });
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.code) {
      setCategories([...categories, { 
        id: Date.now(), 
        ...newCategory 
      }]);
      setNewCategory({ name: '', code: '', description: '' });
    }
  };

  const handleDeleteDistrict = (id: number) => {
    setDistricts(districts.filter(d => d.id !== id));
  };

  const handleDeleteScheme = (id: number) => {
    setSchemes(schemes.filter(s => s.id !== id));
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="districts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="districts" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Districts
          </TabsTrigger>
          <TabsTrigger value="schemes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Schemes
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="districts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New District */}
            <Card>
              <CardHeader>
                <CardTitle>Add New District</CardTitle>
                <CardDescription>Create a new district entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="district-name">District Name</Label>
                  <Input
                    id="district-name"
                    value={newDistrict.name}
                    onChange={(e) => setNewDistrict({...newDistrict, name: e.target.value})}
                    placeholder="Enter district name"
                  />
                </div>
                <div>
                  <Label htmlFor="district-code">District Code</Label>
                  <Input
                    id="district-code"
                    value={newDistrict.code}
                    onChange={(e) => setNewDistrict({...newDistrict, code: e.target.value})}
                    placeholder="Enter district code"
                  />
                </div>
                <div>
                  <Label htmlFor="district-description">Description</Label>
                  <Textarea
                    id="district-description"
                    value={newDistrict.description}
                    onChange={(e) => setNewDistrict({...newDistrict, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddDistrict} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add District
                </Button>
              </CardContent>
            </Card>

            {/* Districts List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Districts</CardTitle>
                <CardDescription>Manage existing districts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {districts.map((district) => (
                    <div key={district.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{district.name}</h4>
                        <p className="text-sm text-gray-600">Code: {district.code}</p>
                        <p className="text-sm text-gray-500">{district.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDistrict(district.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schemes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Scheme */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Scheme</CardTitle>
                <CardDescription>Create a new scheme entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scheme-name">Scheme Name</Label>
                  <Input
                    id="scheme-name"
                    value={newScheme.name}
                    onChange={(e) => setNewScheme({...newScheme, name: e.target.value})}
                    placeholder="Enter scheme name"
                  />
                </div>
                <div>
                  <Label htmlFor="scheme-code">Scheme Code</Label>
                  <Input
                    id="scheme-code"
                    value={newScheme.code}
                    onChange={(e) => setNewScheme({...newScheme, code: e.target.value})}
                    placeholder="Enter scheme code"
                  />
                </div>
                <div>
                  <Label htmlFor="scheme-description">Description</Label>
                  <Textarea
                    id="scheme-description"
                    value={newScheme.description}
                    onChange={(e) => setNewScheme({...newScheme, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddScheme} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scheme
                </Button>
              </CardContent>
            </Card>

            {/* Schemes List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Schemes</CardTitle>
                <CardDescription>Manage existing schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schemes.map((scheme) => (
                    <div key={scheme.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{scheme.name}</h4>
                        <p className="text-sm text-gray-600">Code: {scheme.code}</p>
                        <p className="text-sm text-gray-500">{scheme.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteScheme(scheme.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Category */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Create a new project category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="category-code">Category Code</Label>
                  <Input
                    id="category-code"
                    value={newCategory.code}
                    onChange={(e) => setNewCategory({...newCategory, code: e.target.value})}
                    placeholder="Enter category code"
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
                <CardDescription>Manage existing categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-600">Code: {category.code}</p>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterDataSettings;
