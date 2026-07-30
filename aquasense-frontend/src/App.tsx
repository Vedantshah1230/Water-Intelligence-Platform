import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AIAssistantWidget } from '@/components/shared/AIAssistantWidget';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <AIAssistantWidget />
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
