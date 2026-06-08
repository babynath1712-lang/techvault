import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './pages/routes/AppRoutes';
import Toast from './components/ui/Toast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toast />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
