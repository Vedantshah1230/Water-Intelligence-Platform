import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Settings() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <h2 className="font-headline-lg text-primary mb-gutter">Settings</h2>
      
      <div className="space-y-gutter">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="Sam" />
              <Input label="Last Name" defaultValue="Doe" />
            </div>
            <Input label="Email" type="email" defaultValue="sam.doe@example.com" />
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label-lg">Email Alerts</p>
                <p className="font-body-md text-on-surface-variant">Receive critical system alerts via email.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label-lg">SMS Alerts</p>
                <p className="font-body-md text-on-surface-variant">Receive critical system alerts via SMS.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
