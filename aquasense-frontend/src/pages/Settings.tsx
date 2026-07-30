import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Shield, Bell, Globe, Camera } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-headline-lg text-on-surface">Settings & Preferences</h2>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
            <User className="w-5 h-5" /> User Details
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'notifications' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'security' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
            <Shield className="w-5 h-5" /> Security
          </button>
          <button onClick={() => setActiveTab('preferences')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'preferences' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'}`}>
            <Globe className="w-5 h-5" /> Localization
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-3xl font-bold border-4 border-surface">
                    S
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-md border border-outline-variant hover:bg-surface-container transition-colors">
                      <Camera className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-on-surface">Sam User</h3>
                    <p className="text-on-surface-variant">System Administrator</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue="Sam" />
                  <Input label="Last Name" defaultValue="User" />
                  <Input label="Email Address" type="email" defaultValue="sam@example.com" />
                  <Input label="Phone Number" type="tel" defaultValue="+1 (555) 123-4567" />
                  <Input label="Role" defaultValue="System Administrator" disabled />
                  <Input label="Department" defaultValue="Infrastructure" />
                </div>
                <Button onClick={() => toast.success('Profile details updated!')}>Save Profile</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Email Alerts", desc: "Receive critical system alerts via email." },
                  { title: "SMS Alerts", desc: "Receive critical system alerts via SMS." },
                  { title: "Weekly Reports", desc: "Receive a weekly summary of system performance." },
                  { title: "AI Predictions", desc: "Notify me when a new anomaly is detected by AI." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface-container-lowest">
                    <div>
                      <p className="font-label-md text-on-surface">{item.title}</p>
                      <p className="font-body-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 accent-primary" defaultChecked={idx % 2 === 0} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-label-md text-on-surface mb-4">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                    <Button variant="default" onClick={() => toast.success('Password updated successfully.')}>Update Password</Button>
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant">
                  <h4 className="font-label-md text-on-surface mb-2">Two-Factor Authentication</h4>
                  <p className="font-body-sm text-on-surface-variant mb-4">Add an extra layer of security to your account.</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Localization & Display</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface">Timezone</label>
                  <select className="w-full bg-surface-container p-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary text-on-surface">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Central European Time (CET)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface">Language</label>
                  <select className="w-full bg-surface-container p-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary text-on-surface">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <Button onClick={() => toast.success('Preferences saved.')} className="mt-4">Save Preferences</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
