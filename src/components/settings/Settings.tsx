
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Database, Users, Building2, MapPin, Shield } from 'lucide-react';
import MasterDataSettings from './MasterDataSettings';
import UserSettings from './UserSettings';
import SystemSettings from './SystemSettings';
import SecuritySettings from './SecuritySettings';

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage system configuration and master data</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="master-data" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="master-data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Master Data
          </TabsTrigger>
          <TabsTrigger value="user-settings" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Settings
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="master-data">
          <MasterDataSettings />
        </TabsContent>

        <TabsContent value="user-settings">
          <UserSettings />
        </TabsContent>

        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
