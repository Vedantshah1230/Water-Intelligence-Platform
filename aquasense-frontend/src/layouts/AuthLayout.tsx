import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Brand Section */}
      <div className="md:w-1/2 bg-primary p-12 text-on-primary flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Droplets className="w-8 h-8" />
            <span className="font-headline-md tracking-tight">AquaSense AI</span>
          </div>
          <h1 className="font-headline-lg text-5xl max-w-md leading-tight">
            Intelligent water management for a sustainable future.
          </h1>
        </div>
        <div className="flex gap-4 opacity-80 text-sm">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>

      {/* Auth Content */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="flex items-center gap-2 mb-8 md:hidden text-primary justify-center">
            <Droplets className="w-8 h-8" />
            <span className="font-headline-md tracking-tight">AquaSense AI</span>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
