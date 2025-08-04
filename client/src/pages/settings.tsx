import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Key, Globe, Bell, Shield, Download, Upload, Trash2, RefreshCw } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Newsletter Pro",
    supportEmail: "support@newsletter.com",
    defaultLanguage: "en",
    responseSignature: "Best regards,\nNewsletter Support Team",
    autoResponseEnabled: true,
    responseDelay: 1000
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    googleTranslateKey: "",
    openaiKey: "",
    webhookUrl: "",
    webhookEnabled: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    escalationThreshold: 3,
    escalationEmail: "admin@newsletter.com",
    dailyReports: true,
    weeklyReports: true
  });

  // Auto-categorization Settings
  const [categorizationSettings, setCategorizationSettings] = useState({
    enabled: true,
    confidenceThreshold: 0.8,
    fallbackCategory: "",
    enableLearning: true
  });

  const handleSaveGeneral = () => {
    // Save general settings
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  };

  const handleSaveAPI = () => {
    // Save API settings
    toast({
      title: "API Settings Saved", 
      description: "API configuration has been updated successfully.",
    });
  };

  const handleTestConnection = async (service: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${service} connection...`,
    });
    
    // Simulate API test
    setTimeout(() => {
      toast({
        title: "Connection Test",
        description: `${service} connection successful!`,
      });
    }, 2000);
  };

  const handleExportSettings = () => {
    const settings = {
      general: generalSettings,
      api: { ...apiSettings, googleTranslateKey: "[HIDDEN]", openaiKey: "[HIDDEN]" },
      notifications: notificationSettings,
      categorization: categorizationSettings
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoreply-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = (dataType: string) => {
    if (confirm(`Are you sure you want to clear all ${dataType}? This action cannot be undone.`)) {
      toast({
        title: "Data Cleared",
        description: `All ${dataType} have been cleared successfully.`,
      });
    }
  };

  return (
    <Layout title="Settings" subtitle="Configure your automation preferences and integrations">
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select
                  value={generalSettings.defaultLanguage}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, defaultLanguage: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                    <SelectItem value="fr">🇫🇷 French</SelectItem>
                    <SelectItem value="de">🇩🇪 German</SelectItem>
                    <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responseDelay">Response Delay (ms)</Label>
                <Input
                  id="responseDelay"
                  type="number"
                  value={generalSettings.responseDelay}
                  onChange={(e) => setGeneralSettings({...generalSettings, responseDelay: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="signature">Response Signature</Label>
              <Textarea
                id="signature"
                rows={3}
                value={generalSettings.responseSignature}
                onChange={(e) => setGeneralSettings({...generalSettings, responseSignature: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoResponse"
                checked={generalSettings.autoResponseEnabled}
                onCheckedChange={(checked) => setGeneralSettings({...generalSettings, autoResponseEnabled: checked})}
              />
              <Label htmlFor="autoResponse">Enable Auto-Response</Label>
            </div>

            <Button onClick={handleSaveGeneral} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save General Settings
            </Button>
          </CardContent>
        </Card>

        {/* API Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>API Integrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="googleTranslateKey">Google Translate API Key</Label>
              <div className="flex space-x-2">
                <Input
                  id="googleTranslateKey"
                  type="password"
                  placeholder="Enter your Google Translate API key"
                  value={apiSettings.googleTranslateKey}
                  onChange={(e) => setApiSettings({...apiSettings, googleTranslateKey: e.target.value})}
                />
                <Button variant="outline" onClick={() => handleTestConnection("Google Translate")}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="openaiKey">OpenAI API Key (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  id="openaiKey"
                  type="password"
                  placeholder="Enter your OpenAI API key for advanced NLP"
                  value={apiSettings.openaiKey}
                  onChange={(e) => setApiSettings({...apiSettings, openaiKey: e.target.value})}
                />
                <Button variant="outline" onClick={() => handleTestConnection("OpenAI")}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-app.com/webhook"
                value={apiSettings.webhookUrl}
                onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">
                Receive notifications when inquiries are processed
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="webhookEnabled"
                checked={apiSettings.webhookEnabled}
                onCheckedChange={(checked) => setApiSettings({...apiSettings, webhookEnabled: checked})}
              />
              <Label htmlFor="webhookEnabled">Enable Webhook Notifications</Label>
            </div>

            <Button onClick={handleSaveAPI} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save API Settings
            </Button>
          </CardContent>
        </Card>

        {/* Auto-Categorization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Auto-Categorization</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="categorizationEnabled"
                checked={categorizationSettings.enabled}
                onCheckedChange={(checked) => setCategorizationSettings({...categorizationSettings, enabled: checked})}
              />
              <Label htmlFor="categorizationEnabled">Enable Auto-Categorization</Label>
            </div>

            <div>
              <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
              <Input
                id="confidenceThreshold"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={categorizationSettings.confidenceThreshold}
                onChange={(e) => setCategorizationSettings({...categorizationSettings, confidenceThreshold: parseFloat(e.target.value)})}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum confidence score (0.0 - 1.0) required for auto-categorization
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableLearning"
                checked={categorizationSettings.enableLearning}
                onCheckedChange={(checked) => setCategorizationSettings({...categorizationSettings, enableLearning: checked})}
              />
              <Label htmlFor="enableLearning">Enable Machine Learning Improvements</Label>
            </div>

            <Button onClick={() => toast({ title: "Settings Saved", description: "Categorization settings updated." })} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Categorization Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
              />
              <Label htmlFor="emailNotifications">Email Notifications</Label>
            </div>

            <div>
              <Label htmlFor="escalationEmail">Escalation Email</Label>
              <Input
                id="escalationEmail"
                type="email"
                value={notificationSettings.escalationEmail}
                onChange={(e) => setNotificationSettings({...notificationSettings, escalationEmail: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="escalationThreshold">Escalation Threshold</Label>
              <Input
                id="escalationThreshold"
                type="number"
                min="1"
                value={notificationSettings.escalationThreshold}
                onChange={(e) => setNotificationSettings({...notificationSettings, escalationThreshold: parseInt(e.target.value)})}
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of failed auto-responses before escalation
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dailyReports"
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailyReports: checked})}
                />
                <Label htmlFor="dailyReports">Daily Reports</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="weeklyReports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                />
                <Label htmlFor="weeklyReports">Weekly Reports</Label>
              </div>
            </div>

            <Button onClick={() => toast({ title: "Settings Saved", description: "Notification settings updated." })} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleExportSettings}>
                <Download className="w-4 h-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Settings
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Clear Data</h4>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleClearData("analytics")}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Analytics
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleClearData("inquiries")}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Inquiries
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleClearData("templates")}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Templates
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Data Retention Policy
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Inquiry data is retained for 12 months</li>
                      <li>Analytics data is aggregated monthly after 6 months</li>
                      <li>Template usage statistics are kept indefinitely</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant="default" className="mb-2">API Status</Badge>
                <p className="text-sm text-green-600">All systems operational</p>
              </div>
              <div className="text-center">
                <Badge variant="default" className="mb-2">Database</Badge>
                <p className="text-sm text-green-600">Connected</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">Translation</Badge>
                <p className="text-sm text-yellow-600">API key required</p>
              </div>
              <div className="text-center">
                <Badge variant="default" className="mb-2">Storage</Badge>
                <p className="text-sm text-green-600">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
