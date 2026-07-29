import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AIAssistantWidget } from '@/components/shared/AIAssistantWidget';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <AIAssistantWidget />
    </BrowserRouter>
  );
}

export default App;
