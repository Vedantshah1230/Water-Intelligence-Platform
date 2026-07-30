import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { MapInterface } from '@/pages/MapInterface';
import { Reports } from '@/pages/Reports';
import { Dashboard } from '@/pages/Dashboard';
import { Alerts } from '@/pages/Alerts';

import { Settings } from '@/pages/Settings';
import { AIPredictions } from '@/pages/AIPredictions';
import { Community } from '@/pages/Community';
import { About } from '@/pages/About';

import { LandingPage } from '@/pages/LandingPage';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="map" element={<MapInterface />} />
        <Route path="community" element={<Community />} />
        <Route path="settings" element={<Settings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="predictions" element={<AIPredictions />} />
        <Route path="about" element={<About />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<div className="p-4">User Management (Coming Soon)</div>} />
        <Route path="roles" element={<div className="p-4">Role Management (Coming Soon)</div>} />
        <Route path="system" element={<div className="p-4">System Monitoring (Coming Soon)</div>} />
        <Route path="settings" element={<div className="p-4">Admin Settings (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}
