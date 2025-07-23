
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

const UserSettings = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    district: user?.district || '',
    department: user?.department || '',
    designation: user?.designation || '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    reportAlerts: true,
    systemMaintenance: true,
    language: 'english',
    theme: 'light',
  });

  const handleProfileUpdate = () => {
    console.log('Updating profile:', userProfile);
    // Implementation for profile update
  };

  const handlePreferencesUpdate = () => {
    console.log('Updating preferences:', preferences);
    // Implementation for preferences update
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                value={userProfile.mobile}
                onChange={(e) => setUserProfile({...userProfile, mobile: e.target.value})}
                placeholder="Enter your mobile number"
              />
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={userProfile.designation}
                onChange={(e) => setUserProfile({...userProfile, designation: e.target.value})}
                placeholder="Enter your designation"
              />
            </div>
            <div>
              <Label htmlFor="district">District</Label>
              <Select value={userProfile.district} onValueChange={(value) => setUserProfile({...userProfile, district: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="nashik">Nashik</SelectItem>
                  <SelectItem value="nagpur">Nagpur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={userProfile.department}
                onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                placeholder="Enter your department"
              />
            </div>
            <Button onClick={handleProfileUpdate} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Manage your notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via SMS</p>
              </div>
              <Switch
                id="sms-notifications"
                checked={preferences.smsNotifications}
                onCheckedChange={(checked) => setPreferences({...preferences, smsNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="report-alerts">Report Alerts</Label>
                <p className="text-sm text-gray-600">Get alerts for new reports</p>
              </div>
              <Switch
                id="report-alerts"
                checked={preferences.reportAlerts}
                onCheckedChange={(checked) => setPreferences({...preferences, reportAlerts: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-maintenance">System Maintenance</Label>
                <p className="text-sm text-gray-600">Notifications about system updates</p>
              </div>
              <Switch
                id="system-maintenance"
                checked={preferences.systemMaintenance}
                onCheckedChange={(checked) => setPreferences({...preferences, systemMaintenance: checked})}
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="marathi">Marathi</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePreferencesUpdate} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Update Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
