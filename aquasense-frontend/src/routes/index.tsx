import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { MapInterface } from '@/pages/MapInterface';
import { Reports } from '@/pages/Reports';
import { Dashboard } from '@/pages/Dashboard';
import { Alerts } from '@/pages/Alerts';

import { Settings } from '@/pages/Settings';

import { LandingPage } from '@/pages/LandingPage';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';

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
        <Route path="community" element={<div className="p-4">Community Page (Coming Soon)</div>} />
        <Route path="settings" element={<Settings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="predictions" element={<div className="p-4">AI Predictions Page (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}
