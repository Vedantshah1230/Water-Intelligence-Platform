import React from 'react';
import { Info, Shield, Server, Zap } from 'lucide-react';

export function About() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-headline-lg text-on-surface mb-2">About AquaSense AI</h2>
        <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">
          The next-generation platform for intelligent water management, leveraging predictive AI and real-time IoT monitoring to ensure sustainable water distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="font-headline-sm text-on-surface">System Requirements</h3>
          <ul className="space-y-2 text-on-surface-variant font-body-sm list-disc list-inside">
            <li>Modern Web Browser (Chrome 90+, Firefox 88+, Edge 90+)</li>
            <li>Stable Broadband Internet Connection (10Mbps+)</li>
            <li>Minimum 1024x768 Display Resolution</li>
            <li>JavaScript Enabled</li>
          </ul>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-headline-sm text-on-surface">Platform Version</h3>
          <ul className="space-y-2 text-on-surface-variant font-body-sm list-disc list-inside">
            <li>Current Release: v2.1.0-navy</li>
            <li>Last Updated: July 2026</li>
            <li>AI Model: AS-Predict-v4</li>
            <li>UI Framework: React 19</li>
          </ul>
        </div>
      </div>

      <div className="bg-tertiary-fixed text-on-tertiary-fixed p-8 rounded-2xl border border-outline-variant shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6" />
          <h3 className="font-headline-sm">Data Privacy & Security</h3>
        </div>
        <p className="font-body-sm mb-4">
          AquaSense AI employs end-to-end encryption for all sensor telemetry and user data. We comply with global data protection regulations (GDPR, CCPA) to ensure that your infrastructure data remains secure and confidential.
        </p>
        <p className="font-label-sm text-on-tertiary-fixed-variant">
          For technical support or security disclosures, contact security@aquasense-ai.com
        </p>
      </div>
    </div>
  );
}
