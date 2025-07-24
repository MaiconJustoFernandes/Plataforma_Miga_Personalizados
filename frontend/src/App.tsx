import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import SuppliersPage from './pages/SuppliersPage';
import InsumsPage from './pages/InsumsPage';
import ProductsPage from './pages/ProductsPage';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/:id" element={<CustomerDetailsPage />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="insums" element={<InsumsPage />} />
                <Route path="products" element={<ProductsPage />} />
                {/* Rotas futuras para os módulos */}
                {/* <Route path="orders" element={<OrdersPage />} /> */}
                {/* <Route path="stock" element={<StockPage />} /> */}
                {/* <Route path="financial" element={<FinancialPage />} /> */}
                {/* <Route path="settings" element={<SettingsPage />} /> */}
              </Route>
            </Route>

          </Routes>
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
}

export default App;
