import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your account preferences and application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" name="theme" id="light" className="rounded" />
                  <label htmlFor="light" className="text-sm">Light</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="theme" id="dark" className="rounded" />
                  <label htmlFor="dark" className="text-sm">Dark</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" name="theme" id="system" className="rounded" defaultChecked />
                  <label htmlFor="system" className="text-sm">System</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium">
                Language
              </label>
              <select id="language" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="timezone" className="text-sm font-medium">
                Timezone
              </label>
              <select id="timezone" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Email notifications</div>
                <div className="text-sm text-gray-600">Receive notifications via email</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Browser notifications</div>
                <div className="text-sm text-gray-600">Show desktop notifications</div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Marketing emails</div>
                <div className="text-sm text-gray-600">Product updates and news</div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Billing notifications</div>
                <div className="text-sm text-gray-600">Payment and subscription updates</div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </label>
              <Input id="currentPassword" type="password" />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <Input id="newPassword" type="password" />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <Input id="confirmPassword" type="password" />
            </div>

            <Button>Update Password</Button>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Two-factor authentication</div>
                  <div className="text-sm text-gray-600">Add an extra layer of security</div>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your billing and subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-900">Current Plan</div>
              <div className="text-sm text-gray-600">Professional - $79/month</div>
              <div className="text-xs text-gray-500">Next billing: January 15, 2024</div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Manage Billing
              </Button>
              <Button variant="outline" className="w-full">
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button variant="destructive" size="sm">
                Cancel Subscription
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Your subscription will remain active until the next billing cycle
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save All Changes</Button>
      </div>
    </div>
  )
}