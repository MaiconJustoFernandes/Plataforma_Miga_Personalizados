import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <MantineProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                {/* Rotas aninhadas que aparecerão dentro do AppLayout */}
                {/* Exemplo: <Route path="dashboard" element={<DashboardPage />} /> */}
              </Route>
            </Route>

          </Routes>
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
}

export default App;
