import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}

export default App;
