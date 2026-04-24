import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import InvoicesPage from './pages/dashboard/InvoicesPage';
import ClientsPage from './pages/dashboard/ClientsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import CreateInvoicePage from './pages/dashboard/CreateInvoicePage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        
        {/* Dashboard Routes with Layout */}
        <Route path="/app/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="invoices/create" element={<CreateInvoicePage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                {/* Fallback for /app */}
                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
