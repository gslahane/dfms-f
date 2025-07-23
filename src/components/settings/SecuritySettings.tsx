
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Key, AlertTriangle, Eye, Lock, Save } from 'lucide-react';

const SecuritySettings = () => {
  const [securityConfig, setSecurityConfig] = useState({
    passwordMinLength: '8',
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: '90',
    maxLoginAttempts: '5',
    lockoutDuration: '30',
    twoFactorAuth: false,
    sessionSecurity: true,
    ipWhitelisting: false,
  });

  const [auditConfig, setAuditConfig] = useState({
    enableAuditLog: true,
    logLevel: 'info',
    retentionDays: '365',
    logFailedLogins: true,
    logDataChanges: true,
    logSystemAccess: true,
  });

  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSecurityUpdate = () => {
    console.log('Updating security configuration:', securityConfig);
    // Implementation for security config update
  };

  const handleAuditUpdate = () => {
    console.log('Updating audit configuration:', auditConfig);
    // Implementation for audit config update
  };

  const handlePasswordChange = () => {
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    console.log('Changing password...');
    // Implementation for password change
    setChangePassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Password Policy
            </CardTitle>
            <CardDescription>Configure password requirements and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password-min-length">Minimum Password Length</Label>
              <Input
                id="password-min-length"
                type="number"
                value={securityConfig.passwordMinLength}
                onChange={(e) => setSecurityConfig({...securityConfig, passwordMinLength: e.target.value})}
                placeholder="Enter minimum length"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-uppercase">Require Uppercase</Label>
                <p className="text-sm text-gray-600">Require at least one uppercase letter</p>
              </div>
              <Switch
                id="require-uppercase"
                checked={securityConfig.requireUppercase}
                onCheckedChange={(checked) => setSecurityConfig({...securityConfig, requireUppercase: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-numbers">Require Numbers</Label>
                <p className="text-sm text-gray-600">Require at least one number</p>
              </div>
              <Switch
                id="require-numbers"
                checked={securityConfig.requireNumbers}
                onCheckedChange={(checked) => setSecurityConfig({...securityConfig, requireNumbers: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-special">Require Special Characters</Label>
                <p className="text-sm text-gray-600">Require at least one special character</p>
              </div>
              <Switch
                id="require-special"
                checked={securityConfig.requireSpecialChars}
                onCheckedChange={(checked) => setSecurityConfig({...securityConfig, requireSpecialChars: checked})}
              />
            </div>
            <div>
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
              <Input
                id="password-expiry"
                type="number"
                value={securityConfig.passwordExpiry}
                onChange={(e) => setSecurityConfig({...securityConfig, passwordExpiry: e.target.value})}
                placeholder="Enter expiry days"
              />
            </div>
            <Button onClick={handleSecurityUpdate} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update Password Policy
            </Button>
          </CardContent>
        </Card>

        {/* Login Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Login Security
            </CardTitle>
            <CardDescription>Configure login security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input
                id="max-login-attempts"
                type="number"
                value={securityConfig.maxLoginAttempts}
                onChange={(e) => setSecurityConfig({...securityConfig, maxLoginAttempts: e.target.value})}
                placeholder="Enter max attempts"
              />
            </div>
            <div>
              <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
              <Input
                id="lockout-duration"
                type="number"
                value={securityConfig.lockoutDuration}
                onChange={(e) => setSecurityConfig({...securityConfig, lockoutDuration: e.target.value})}
                placeholder="Enter lockout duration"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">Enable 2FA for all users</p>
              </div>
              <Switch
                id="two-factor-auth"
                checked={securityConfig.twoFactorAuth}
                onCheckedChange={(checked) => setSecurityConfig({...securityConfig, twoFactorAuth: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session-security">Enhanced Session Security</Label>
                <p className="text-sm text-gray-600">Enable advanced session protection</p>
              </div>
              <Switch
                id="session-security"
                checked={securityConfig.sessionSecurity}
                onCheckedChange={(checked) => setSecurityConfig({...securityConfig, sessionSecurity: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ip-whitelisting">IP Whitelisting</Label>
                <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
              </div>
              <Switch
                id="ip-whitelisting"
                checked={securityConfig.ipWhitelisting}
                onCheckedChange={(checked) => setSecurityConfig({...securityConfig, ipWhitelisting: checked})}
              />
            </div>
            <Button onClick={handleSecurityUpdate} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update Login Security
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={changePassword.currentPassword}
                onChange={(e) => setChangePassword({...changePassword, currentPassword: e.target.value})}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={changePassword.newPassword}
                onChange={(e) => setChangePassword({...changePassword, newPassword: e.target.value})}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={changePassword.confirmPassword}
                onChange={(e) => setChangePassword({...changePassword, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
              />
            </div>
            <Button onClick={handlePasswordChange} className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Audit & Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Audit & Monitoring
            </CardTitle>
            <CardDescription>Configure system audit and monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-audit-log">Enable Audit Log</Label>
                <p className="text-sm text-gray-600">Log all system activities</p>
              </div>
              <Switch
                id="enable-audit-log"
                checked={auditConfig.enableAuditLog}
                onCheckedChange={(checked) => setAuditConfig({...auditConfig, enableAuditLog: checked})}
              />
            </div>
            <div>
              <Label htmlFor="log-level">Log Level</Label>
              <Select value={auditConfig.logLevel} onValueChange={(value) => setAuditConfig({...auditConfig, logLevel: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="retention-days">Log Retention (days)</Label>
              <Input
                id="retention-days"
                type="number"
                value={auditConfig.retentionDays}
                onChange={(e) => setAuditConfig({...auditConfig, retentionDays: e.target.value})}
                placeholder="Enter retention days"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="log-failed-logins">Log Failed Logins</Label>
                <p className="text-sm text-gray-600">Track failed login attempts</p>
              </div>
              <Switch
                id="log-failed-logins"
                checked={auditConfig.logFailedLogins}
                onCheckedChange={(checked) => setAuditConfig({...auditConfig, logFailedLogins: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="log-data-changes">Log Data Changes</Label>
                <p className="text-sm text-gray-600">Track all data modifications</p>
              </div>
              <Switch
                id="log-data-changes"
                checked={auditConfig.logDataChanges}
                onCheckedChange={(checked) => setAuditConfig({...auditConfig, logDataChanges: checked})}
              />
            </div>
            <Button onClick={handleAuditUpdate} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update Audit Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
