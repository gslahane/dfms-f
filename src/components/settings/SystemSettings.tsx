
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Server, Database, Globe, Clock, Save, RefreshCw } from 'lucide-react';

const SystemSettings = () => {
  const [systemConfig, setSystemConfig] = useState({
    applicationName: '',
    version: '1.0.0',
    maintenanceMode: false,
    backupEnabled: true,
    autoBackupHours: '24',
    sessionTimeout: '30',
    maxFileSize: '10',
    allowedFileTypes: 'pdf,doc,docx,xls,xlsx,jpg,png',
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@maharashtra.gov.in',
    fromName: '',
  });

  const handleSystemUpdate = () => {
    console.log('Updating system configuration:', systemConfig);
    // Implementation for system config update
  };

  const handleEmailUpdate = () => {
    console.log('Updating email configuration:', emailConfig);
    // Implementation for email config update
  };

  const handleBackupNow = () => {
    console.log('Starting manual backup...');
    // Implementation for manual backup
  };

  const handleClearCache = () => {
    console.log('Clearing system cache...');
    // Implementation for cache clearing
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>General system settings and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="app-name">Application Name</Label>
              <Input
                id="app-name"
                value={systemConfig.applicationName}
                onChange={(e) => setSystemConfig({...systemConfig, applicationName: e.target.value})}
                placeholder="Enter application name"
              />
            </div>
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={systemConfig.version}
                onChange={(e) => setSystemConfig({...systemConfig, version: e.target.value})}
                placeholder="Enter version"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Enable to restrict system access</p>
              </div>
              <Switch
                id="maintenance-mode"
                checked={systemConfig.maintenanceMode}
                onCheckedChange={(checked) => setSystemConfig({...systemConfig, maintenanceMode: checked})}
              />
            </div>
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={systemConfig.sessionTimeout}
                onChange={(e) => setSystemConfig({...systemConfig, sessionTimeout: e.target.value})}
                placeholder="Enter session timeout"
              />
            </div>
            <div>
              <Label htmlFor="max-file-size">Max File Size (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                value={systemConfig.maxFileSize}
                onChange={(e) => setSystemConfig({...systemConfig, maxFileSize: e.target.value})}
                placeholder="Enter max file size"
              />
            </div>
            <div>
              <Label htmlFor="allowed-file-types">Allowed File Types</Label>
              <Input
                id="allowed-file-types"
                value={systemConfig.allowedFileTypes}
                onChange={(e) => setSystemConfig({...systemConfig, allowedFileTypes: e.target.value})}
                placeholder="Enter allowed file types (comma separated)"
              />
            </div>
            <Button onClick={handleSystemUpdate} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update System Settings
            </Button>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>Configure email server settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input
                id="smtp-server"
                value={emailConfig.smtpServer}
                onChange={(e) => setEmailConfig({...emailConfig, smtpServer: e.target.value})}
                placeholder="Enter SMTP server"
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
                placeholder="Enter SMTP port"
              />
            </div>
            <div>
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input
                id="smtp-username"
                value={emailConfig.smtpUsername}
                onChange={(e) => setEmailConfig({...emailConfig, smtpUsername: e.target.value})}
                placeholder="Enter SMTP username"
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input
                id="smtp-password"
                type="password"
                value={emailConfig.smtpPassword}
                onChange={(e) => setEmailConfig({...emailConfig, smtpPassword: e.target.value})}
                placeholder="Enter SMTP password"
              />
            </div>
            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Input
                id="from-email"
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                placeholder="Enter from email"
              />
            </div>
            <div>
              <Label htmlFor="from-name">From Name</Label>
              <Input
                id="from-name"
                value={emailConfig.fromName}
                onChange={(e) => setEmailConfig({...emailConfig, fromName: e.target.value})}
                placeholder="Enter from name"
              />
            </div>
            <Button onClick={handleEmailUpdate} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update Email Settings
            </Button>
          </CardContent>
        </Card>

        {/* Backup & Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Maintenance
            </CardTitle>
            <CardDescription>Manage system backups and maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="backup-enabled">Auto Backup</Label>
                <p className="text-sm text-gray-600">Enable automatic backups</p>
              </div>
              <Switch
                id="backup-enabled"
                checked={systemConfig.backupEnabled}
                onCheckedChange={(checked) => setSystemConfig({...systemConfig, backupEnabled: checked})}
              />
            </div>
            <div>
              <Label htmlFor="backup-hours">Backup Frequency (hours)</Label>
              <Select 
                value={systemConfig.autoBackupHours} 
                onValueChange={(value) => setSystemConfig({...systemConfig, autoBackupHours: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select backup frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">Every 6 hours</SelectItem>
                  <SelectItem value="12">Every 12 hours</SelectItem>
                  <SelectItem value="24">Daily</SelectItem>
                  <SelectItem value="168">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Button onClick={handleBackupNow} className="w-full" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Backup Now
              </Button>
              <Button onClick={handleClearCache} className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>View system status and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Server Status</Label>
                <p className="text-sm font-medium text-green-600">Online</p>
              </div>
              <div>
                <Label>Database Status</Label>
                <p className="text-sm font-medium text-green-600">Connected</p>
              </div>
              <div>
                <Label>Last Backup</Label>
                <p className="text-sm text-gray-600">2024-01-15 02:00 AM</p>
              </div>
              <div>
                <Label>Uptime</Label>
                <p className="text-sm text-gray-600">15 days, 3 hours</p>
              </div>
              <div>
                <Label>Total Users</Label>
                <p className="text-sm text-gray-600">1,247</p>
              </div>
              <div>
                <Label>Active Sessions</Label>
                <p className="text-sm text-gray-600">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;
