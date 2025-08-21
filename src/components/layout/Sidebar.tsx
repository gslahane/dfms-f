import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  IndianRupee,
  Users,
  Building2,
  FileText,
  BarChart3,
  TrendingUp,
  CheckCircle,
  CreditCard,
  ArrowLeftRight
} from 'lucide-react';

// Role names must match backend exactly
const SIDEBAR_CONFIG = {
  STATE_ADMIN: [
    { path: '/dashboard',            icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/budget-allocation',  icon: CreditCard,     label: 'Budget Allocation' },
    // { path: '/fund-demands',         icon: Users,           label: 'View District Fund Demands' },
    { path: '/mla-fund-demands',     icon: IndianRupee,           label: 'View Fund Demands' },
    
    // { path: '/scheme-master',        icon: FileText,        label: 'Scheme Master' },
    { path: '/mla-mlc-master',        icon: Users,        label: 'MLA|MLC Master' },
    { path: '/district-management',  icon: Building2,       label: 'District Master' },
    { path: '/fund-history',         icon: ArrowLeftRight,        label: 'Vouchers' },
    { path: '/reports',              icon: BarChart3,       label: 'Reports' }
  ],
  DISTRICT_ADMIN: [
    { path: '/district-dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/view-demands',         icon: CheckCircle,     label: 'View IA Demands' },
    { path: '/mla-mlc-recommendation', icon: IndianRupee,           label: 'View Mla Recommendation' },

    { path: '/fund-allocation',      icon: IndianRupee,     label: 'Budget Sanctioned to Schemes' },
    // { path: '/scheme-master',        icon: FileText,        label: 'Scheme Master' },
    { path: '/ia-master',            icon: Users,           label: 'IA Master' },
    { path: '/work-master',          icon: FileText,        label: 'Scheme-Work Master' },
    { path: '/reappropriation',      icon: ArrowLeftRight,  label: 'Re-appropriation' },
    { path: '/reports',              icon: BarChart3,       label: 'Reports' }
  ],
  IA_ADMIN: [
    { path: '/iadashboard',            icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/fund-demand',          icon: CreditCard,      label: 'Fund Demand' },
    { path: '/vendor-master',        icon: Users,           label: 'Vendor Master' },
    { path: '/work-vendor',          icon: TrendingUp,      label: 'Work Vendor Mapping' },
    { path: '/tax-master',           icon: FileText,        label: 'Tax/Deduction Master' },

    // { path: '/project-progress',     icon: TrendingUp,      label: 'Project Progress' },
    { path: '/reports',              icon: BarChart3,       label: 'Reports' }
  ]
};

const Sidebar = () => {
  const { user } = useAuth();

  // Fallback for no user/role
  const role = user?.role || 'IA_ADMIN';
  const navigationItems = SIDEBAR_CONFIG[role] || SIDEBAR_CONFIG['IA_ADMIN'];

  return (
    <aside className="bg-white shadow-lg h-full w-64 fixed left-0 top-0 z-50 border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">MH</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">FMS</h2>
            <p className="text-xs text-gray-600">{role.replace('_', ' ')} Portal</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {navigationItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: User Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-600">{user?.department || ''}</p>
          <p className="text-xs text-gray-500">{user?.district || ''}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

