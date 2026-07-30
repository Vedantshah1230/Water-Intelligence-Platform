import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopAppBar } from '@/components/shared/TopAppBar';
import { BottomNavBar } from '@/components/shared/BottomNavBar';
import { Sidebar } from '@/components/shared/Sidebar';
import { AquaSenseAIAssistant } from '@/components/chat/AquaSenseAIAssistant';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <TopAppBar />
      <div className="flex max-w-7xl mx-auto w-full">
        <Sidebar />
        <main className="flex-1 px-margin-mobile md:px-margin-desktop py-base pb-32 md:pb-10 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <BottomNavBar />
      <AquaSenseAIAssistant />
    </div>
  );
}
