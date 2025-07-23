
import React from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { UserRecord } from './FundDemand';

interface UserStatsProps {
  users: UserRecord[];
}

const UserStats: React.FC<UserStatsProps> = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.isActive).length;
  const inactiveUsers = users.filter(user => !user.isActive).length;
  const firstLoginPending = users.filter(user => user.isFirstLogin).length;

  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      icon: UserX,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'First Login Pending',
      value: firstLoginPending,
      icon: Shield,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={`${stat.bgColor} rounded-lg p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(roleStats).map(([role, count]) => {
            const getRoleInfo = (role: string) => {
              switch (role) {
                case 'SNA': return { name: 'State Nodal Agency', color: 'bg-red-100 text-red-800' };
                case 'DNA': return { name: 'District Nodal Agency', color: 'bg-blue-100 text-blue-800' };
                case 'IDA': return { name: 'Implementation District Agency', color: 'bg-green-100 text-green-800' };
                case 'IA': return { name: 'Implementation Agency', color: 'bg-yellow-100 text-yellow-800' };
                default: return { name: role, color: 'bg-gray-100 text-gray-800' };
              }
            };

            const roleInfo = getRoleInfo(role);

            return (
              <div key={role} className="text-center p-4 rounded-lg border border-gray-200">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color} mb-2`}>
                  {role}
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">{roleInfo.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserStats;
