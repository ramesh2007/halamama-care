// ─── App Root Component ─────────────────────────────────────────────────────
// Mounts BrowserRouter, handles theme persistence, socket lifecycle, and route dispatching.

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { initSocket, disconnectSocket } from './services/socket';
import { useCareStore, applyThemeMode } from './store/useCareStore';

function App() {
  const theme = useCareStore((s) => s.theme);
  const isAuthenticated = useCareStore((s) => s.isAuthenticated);

  useEffect(() => {
    applyThemeMode(theme);
    if (isAuthenticated) {
      initSocket();
      return () => disconnectSocket();
    }
  }, [theme, isAuthenticated]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
