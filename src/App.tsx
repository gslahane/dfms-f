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
import FundHistory from '@/components/sna/FundHistory'
import MlaRegister from '@/components/sna/MlaRegister'
import MlaFundDemand from '@/components/sna/MlaFundDemand'
import DistrictDashboard from '@/components/dna/DistrictDashboard';
import IaMaster from '@/components/dna/IaMaster';
import WorkMaster from '@/components/dna/WorkMaster';
import FundAllocation from '@/components/dna/FundAllocation';
import BudgetAllocation from '@/components/sna/BudgetAllocation';
import UserManagement from '@/components/sna/FundDemand';
import DepartmentManagement from '@/components/sna/DepartmentManagement';
import FundApproval from '@/components/dna/FundApproval';
import ReturnFunds from '@/components/dna/ReturnFunds';
import FundDisbursement from '@/components/ia/FundDisbursement';
import VendorMaster from '@/components/ia/VendorMaster';
import ProjectApproval from '@/components/dna/SchemeMaster';
import NotFound from "./pages/NotFound";
import Reports from '@/components/reports/Reports';
import Settings from '@/components/settings/Settings';
import TaxMaster from './components/tax-master/tax-master';
import ViewRecommendation from './components/sna/ViewRecommendation';

const queryClient = new QueryClient();

/** 
 * PrivateRoute: Wrapper to check login state
 * @param children - the component to render if authenticated
 */
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

const HomeRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null; // or a spinner

  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'IA_ADMIN':
      return <Navigate to="/iadashboard" replace />;
    case 'DISTRICT_ADMIN':
      return <Navigate to="/district-dashboard" replace />;
    case 'STATE_ADMIN':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />; // fallback
  }
};

const getRoleBasedRoutes = (user: any) => {
  if (!user) return [];
  switch (user.role) {
    case 'STATE_ADMIN':
      return [
        <Route key="dashboard" path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />,
        <Route key="budget-allocation" path="/budget-allocation" element={<PrivateRoute><BudgetAllocation /></PrivateRoute>} />,
        <Route key="district-management" path="/district-management" element={<PrivateRoute><DepartmentManagement /></PrivateRoute>} />,
        // <Route key="fund-demands" path="/fund-demands" element={<PrivateRoute><UserManagement /></PrivateRoute>} />,
        <Route key="mla-fund-demands" path="/mla-fund-demands" element={<PrivateRoute>< MlaFundDemand/></PrivateRoute>} />,
        // <Route key="scheme-master" path="/scheme-master" element={<PrivateRoute><ProjectApproval /></PrivateRoute>} />,
        <Route key="tax-master" path="/tax-master" element={<PrivateRoute><TaxMaster /></PrivateRoute>} />,
        <Route key="mla-master" path="/mla-mlc-master" element={<PrivateRoute><MlaRegister /></PrivateRoute>} />,


        <Route key="reports" path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />,
        <Route key="fund-history" path="/fund-history" element={<PrivateRoute><FundHistory /></PrivateRoute>} />,
        <Route key="settings" path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      ];
    case 'DISTRICT_ADMIN':
      return [
        <Route key="dashboard" path="/district-dashboard" element={<PrivateRoute><DistrictDashboard /></PrivateRoute>} />,
        <Route key="view-demands" path="/view-demands" element={<PrivateRoute><FundApproval /></PrivateRoute>} />,
        <Route key="fund-allocation" path="/fund-allocation" element={<PrivateRoute><FundAllocation /></PrivateRoute>} />,
        <Route key="ia-master" path="/ia-master" element={<PrivateRoute><IaMaster /></PrivateRoute>} />,
        <Route key="mla-recommendation" path="/mla-mlc-recommendation" element={<PrivateRoute><ViewRecommendation /></PrivateRoute>} />,

        // <Route key="scheme-master" path="/scheme-master" element={<PrivateRoute><SchemeMaster /></PrivateRoute>} />,
        <Route key="work-master" path="/work-master" element={<PrivateRoute><WorkMaster /></PrivateRoute>} />,
        <Route key="reappropriation" path="/reappropriation" element={<PrivateRoute><ReturnFunds /></PrivateRoute>} />,
        <Route key="reports" path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      ];
    case 'IA_ADMIN':
      return [
        <Route key="dashboard" path="/iadashboard" element={<PrivateRoute><IaDashboard /></PrivateRoute>} />,
        <Route key="fund-demand" path="/fund-demand" element={<PrivateRoute><FundDisbursement /></PrivateRoute>} />,
        <Route key="vendor-master" path="/vendor-master" element={<PrivateRoute><VendorMaster /></PrivateRoute>} />,
        <Route key="work-vendor" path="/work-vendor" element={<PrivateRoute><WorkVendor /></PrivateRoute>} />,
        <Route key="tax-master" path="/tax-master" element={<PrivateRoute><TaxMaster /></PrivateRoute>} />,
        <Route key="reports" path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      ];
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
              : user.role === 'DISTRICT_ADMIN'
                ? <Navigate to="/district-dashboard" replace />
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
