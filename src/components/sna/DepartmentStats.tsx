
import React from 'react';
import { Building2, Users, CheckCircle, XCircle, TrendingUp, IndianRupee } from 'lucide-react';
import { DepartmentRecord } from './DepartmentManagement';

interface DepartmentStatsProps {
  departments: DepartmentRecord[];
}

const DepartmentStats: React.FC<DepartmentStatsProps> = ({ departments }) => {
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(dept => dept.isActive).length;
  const inactiveDepartments = departments.filter(dept => !dept.isActive).length;
  const totalUsers = departments.reduce((sum, dept) => sum + dept.totalUsers, 0);
  const totalProjects = departments.reduce((sum, dept) => sum + dept.totalProjects, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.totalBudget, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: 'Total Districts',
      value: totalDepartments,
      icon: Building2,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Districts',
      value: activeDepartments,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Inactive Districts',
      value: inactiveDepartments,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      icon: IndianRupee,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      isAmount: true
    }
  ];

  // District-wise distribution
  const districtStats = departments.reduce((acc, dept) => {
    acc[dept.district] = (acc[dept.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDistricts = Object.entries(districtStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={`${stat.bgColor} rounded-lg p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`${stat.isAmount ? 'text-xl' : 'text-3xl'} font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* District Distribution */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Districts </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topDistricts.map(([district, count]) => (
            <div key={district} className="text-center p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{district}</div>
              <div className="text-xs text-gray-500">Districts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;
