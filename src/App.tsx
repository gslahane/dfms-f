import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import IaDashboard from '@/components/ia/IaDashboard';
import WorkVendor from '@/components/ia/WorkVendor';
import FundHistory from '@/components/sna/FundHistory';
import MlaRegister from '@/components/sna/MlaRegister';
import MlaFundDemand from '@/components/sna/MlaFundDemand';
import DistrictDashboard from '@/components/dna/DistrictDashboard';
import IaMaster from '@/components/dna/IaMaster';
import WorkMaster from '@/components/dna/WorkMaster';
import FundAllocation from '@/components/dna/FundAllocation';
import BudgetAllocation from '@/components/sna/BudgetAllocation';
import DepartmentManagement from '@/components/sna/DepartmentManagement';
import FundApproval from '@/components/dna/FundApproval';
import ReturnFunds from '@/components/dna/ReturnFunds';
import FundDisbursement from '@/components/ia/FundDisbursement';
import VendorMaster from '@/components/ia/VendorMaster';
import NotFound from "./pages/NotFound";
import Reports from '@/components/reports/Reports';
import Settings from '@/components/settings/Settings';
import TaxMaster from './components/tax-master/tax-master';
import ViewRecommendation from './components/sna/ViewRecommendation';

// MLA
import MlaDashboard from '@/components/mla/Dashboard';
import MlaViewRecommendation from '@/components/mla/ViewRecommendation';
import MlaReports from '@/components/mla/Reports';

// MLC
import MlcDashboard from '@/components/mlc/Dashboard';
import MlcViewRecommendation from '@/components/mlc/ViewRecommendation';
import MlcReports from '@/components/mlc/Reports';

// Contractor / Vendor
import ContractorDashboard from '@/components/vendor/Dashbaord';
import ContractorViewWorks from '@/components/vendor/viewWorks';

const queryClient = new QueryClient();

/** PrivateRoute */
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

/** Home redirect by role */
const HomeRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'IA_ADMIN':
      return <Navigate to="/iadashboard" replace />;
    case 'DISTRICT_ADMIN':
    case 'DISTRICT_COLLECTOR':
    case 'DISTRICT_DPO':
    case 'DISTRICT_ADPO':
    case 'DISTRICT_CHECKER':
    case 'DISTRICT_MAKER':
      return <Navigate to="/district-dashboard" replace />;
    case 'STATE_ADMIN':
    case 'STATE_CHECKER':
    case 'STATE_MAKER':
      return <Navigate to="/dashboard" replace />;
    case 'MLA':
    case 'MLA_REP':
      return <Navigate to="/mla/dashboard" replace />;
    case 'MLC':
      return <Navigate to="/mlc/dashboard" replace />;
    case 'HADP_ADMIN':
      return <Navigate to="/hadp/dashboard" replace />;
    case 'VENDOR':
      return <Navigate to="/vendor/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

/** Role-based routes */
const getRoleBasedRoutes = (user: any) => {
  if (!user) return [];

  switch (user.role) {
    /** STATE */
    case 'STATE_ADMIN':
    case 'STATE_CHECKER':
    case 'STATE_MAKER':
      return [
        <Route key="dashboard" path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />,
        <Route key="budget-allocation" path="/budget-allocation" element={<PrivateRoute><BudgetAllocation /></PrivateRoute>} />,
        <Route key="district-management" path="/district-management" element={<PrivateRoute><DepartmentManagement /></PrivateRoute>} />,
        <Route key="mla-fund-demands" path="/mla-fund-demands" element={<PrivateRoute><MlaFundDemand /></PrivateRoute>} />,
        <Route key="mla-master" path="/mla-mlc-master" element={<PrivateRoute><MlaRegister /></PrivateRoute>} />,
        <Route key="tax-master" path="/tax-master" element={<PrivateRoute><TaxMaster /></PrivateRoute>} />,
        <Route key="fund-history" path="/fund-history" element={<PrivateRoute><FundHistory /></PrivateRoute>} />,
        <Route key="reports" path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />,
        <Route key="settings" path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      ];

    case 'DISTRICT_ADMIN':
    case 'DISTRICT_COLLECTOR':
    case 'DISTRICT_DPO':
    case 'DISTRICT_ADPO':
    case 'DISTRICT_CHECKER':
    case 'DISTRICT_MAKER':
      return [
        <Route key="dashboard" path="/district-dashboard" element={<PrivateRoute><DistrictDashboard /></PrivateRoute>} />,
        <Route key="view-demands" path="/view-demands" element={<PrivateRoute><FundApproval /></PrivateRoute>} />,
        <Route key="fund-allocation" path="/fund-allocation" element={<PrivateRoute><FundAllocation /></PrivateRoute>} />,
        <Route key="ia-master" path="/ia-master" element={<PrivateRoute><IaMaster /></PrivateRoute>} />,
        <Route key="mla-recommendation" path="/mla-mlc-recommendation" element={<PrivateRoute><ViewRecommendation /></PrivateRoute>} />,
        <Route key="work-master" path="/work-master" element={<PrivateRoute><WorkMaster /></PrivateRoute>} />,
        <Route key="reappropriation" path="/reappropriation" element={<PrivateRoute><ReturnFunds /></PrivateRoute>} />,
        <Route key="reports" path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      ];

    /** IA */
    case 'IA_ADMIN':
      return [
        <Route key="dashboard" path="/iadashboard" element={<PrivateRoute><IaDashboard /></PrivateRoute>} />,
        <Route key="fund-demand" path="/fund-demand" element={<PrivateRoute><FundDisbursement /></PrivateRoute>} />,
        <Route key="vendor-master" path="/vendor-master" element={<PrivateRoute><VendorMaster /></PrivateRoute>} />,
        <Route key="work-vendor" path="/work-vendor" element={<PrivateRoute><WorkVendor /></PrivateRoute>} />,
        <Route key="tax-master" path="/tax-master" element={<PrivateRoute><TaxMaster /></PrivateRoute>} />,
        <Route key="reports" path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      ];

    case 'MLA':
    case 'MLA_REP':
      return [
        <Route key="mla-dashboard" path="/mla/dashboard" element={<PrivateRoute><MlaDashboard /></PrivateRoute>} />,
        <Route key="mla-recommendation" path="/mla/view-recommendation" element={<PrivateRoute><MlaViewRecommendation /></PrivateRoute>} />,
        <Route key="mla-reports" path="/mla/reports" element={<PrivateRoute><MlaReports /></PrivateRoute>} />
      ];
    case 'MLC':
      return [
        <Route key="mlc-dashboard" path="/mlc/dashboard" element={<PrivateRoute><MlcDashboard /></PrivateRoute>} />,
        <Route key="mlc-recommendation" path="/mlc/view-recommendation" element={<PrivateRoute><MlcViewRecommendation /></PrivateRoute>} />,
        <Route key="mlc-reports" path="/mlc/reports" element={<PrivateRoute><MlcReports /></PrivateRoute>} />
      ];

    /** HADP */
    case 'HADP_ADMIN':
      return [
        <Route key="hadp-dashboard" path="/hadp/dashboard" element={<PrivateRoute><div>HADP Dashboard (coming soon)</div></PrivateRoute>} />
      ];

    /** VENDOR */
    case 'VENDOR':
      return [
        <Route key="vendor-dashboard" path="/vendor/dashboard" element={<PrivateRoute><ContractorDashboard /></PrivateRoute>} />,
        // <Route key="vendor-works" path="/vendor/view-works" element={<PrivateRoute><ContractorViewWorks /></PrivateRoute>} />
      ];

    /** DEFAULT */
    default:
      return [
        <Route key="dashboard" path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      ];
  }
};

const AuthenticatedApp = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (user) setShowLogin(false);
  }, [user]);

  if (showLogin && !user) {
    return <LoginForm onSuccess={() => setShowLogin(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/login"
        element={
          user
            ? user.role === 'IA_ADMIN'
              ? <Navigate to="/iadashboard" replace />
              : user.role?.startsWith('DISTRICT')
                ? <Navigate to="/district-dashboard" replace />
                : user.role?.startsWith('STATE')
                  ? <Navigate to="/dashboard" replace />
                  : user.role === 'MLA' || user.role === 'MLA_REP'
                    ? <Navigate to="/mla/dashboard" replace />
                    : user.role === 'MLC'
                      ? <Navigate to="/mlc/dashboard" replace />
                      : user.role === 'HADP_ADMIN'
                        ? <Navigate to="/hadp/dashboard" replace />
                        : user.role === 'VENDOR'
                          ? <Navigate to="/vendor/dashboard" replace />
                          : <Navigate to="/dashboard" replace />
            : <LoginForm onSuccess={() => setShowLogin(false)} />
        }
      />
      {...getRoleBasedRoutes(user)}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
