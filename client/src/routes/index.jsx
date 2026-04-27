import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import SignupPage from '../pages/public/SignupPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import InvoicesPage from '../pages/dashboard/InvoicesPage';
import PaymentsPage from '../pages/dashboard/PaymentsPage';
import ClientsPage from '../pages/dashboard/ClientsPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import CreateInvoicePage from '../pages/dashboard/CreateInvoicePage';
import EditInvoicePage from '../pages/dashboard/EditInvoicePage';
import ExpensesPage from '../pages/dashboard/ExpensesPage';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

const AppRoutes = () => {
  return (
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
              <Route path="invoices/edit/:id" element={<EditInvoicePage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              {/* Fallback for /app */}
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
