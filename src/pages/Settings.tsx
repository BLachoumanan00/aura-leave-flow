
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState("user@example.com");
  
  // Data settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  
  // Display settings
  const [calendarFirstDay, setCalendarFirstDay] = useState("monday");
  const [dateFormat, setDateFormat] = useState("MMMM d, yyyy");
  
  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };
  
  const handleSaveDataSettings = () => {
    toast.success("Data settings saved");
  };
  
  const handleSaveDisplaySettings = () => {
    toast.success("Display settings saved");
  };
  
  const handleExportData = () => {
    toast.success("Data exported successfully");
  };
  
  const handleRestoreBackup = () => {
    // This would show a file upload dialog in a real app
    toast.success("Data restored from backup");
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your Aura Leave experience
        </p>
      </div>
      
      <div className="space-y-6 max-w-4xl">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Manage the appearance of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme Mode</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose between light, dark, or system-based theme
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("Theme settings saved")}>
              Save Theme Settings
            </Button>
          </CardFooter>
        </Card>
        
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            {emailNotifications && (
              <div className="space-y-2">
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                />
              </div>
            )}
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your device
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveNotifications}>
              Save Notification Settings
            </Button>
          </CardFooter>
        </Card>
        
        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Backup, restore, and manage your leave data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-backup">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup your data
                </p>
              </div>
              <Switch
                id="auto-backup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
            
            {autoBackup && (
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select
                  value={backupFrequency}
                  onValueChange={setBackupFrequency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Separator />
            
            <div className="flex flex-col space-y-2">
              <Label>Manual Data Operations</Label>
              <div className="flex gap-4 mt-2">
                <Button variant="outline" onClick={handleExportData}>
                  Export Data
                </Button>
                <Button variant="outline" onClick={handleRestoreBackup}>
                  Restore from Backup
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveDataSettings}>
              Save Data Settings
            </Button>
          </CardFooter>
        </Card>
        
        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Customize how information is displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calendar-first-day">Calendar First Day</Label>
              <Select
                value={calendarFirstDay}
                onValueChange={setCalendarFirstDay}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MMMM d, yyyy">April 8, 2025</SelectItem>
                  <SelectItem value="MM/dd/yyyy">04/08/2025</SelectItem>
                  <SelectItem value="dd/MM/yyyy">08/04/2025</SelectItem>
                  <SelectItem value="yyyy-MM-dd">2025-04-08</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveDisplaySettings}>
              Save Display Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
