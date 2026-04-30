import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Lazy load pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const SignupPage = lazy(() => import('../pages/public/SignupPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const InvoicesPage = lazy(() => import('../pages/dashboard/InvoicesPage'));
const PaymentsPage = lazy(() => import('../pages/dashboard/PaymentsPage'));
const ClientsPage = lazy(() => import('../pages/dashboard/ClientsPage'));
const SettingsPage = lazy(() => import('../pages/dashboard/SettingsPage'));
const AnalyticsPage = lazy(() => import('../pages/dashboard/AnalyticsPage'));
const CreateInvoicePage = lazy(() => import('../pages/dashboard/CreateInvoicePage'));
const EditInvoicePage = lazy(() => import('../pages/dashboard/EditInvoicePage'));
const ExpensesPage = lazy(() => import('../pages/dashboard/ExpensesPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        
        {/* Dashboard Routes with Layout */}
        <Route path="/app/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<Loader />}>
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
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
