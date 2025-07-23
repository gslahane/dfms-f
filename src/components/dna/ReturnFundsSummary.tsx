
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, Clock, CheckCircle, ArrowLeftRight } from 'lucide-react';
import { ReturnFundRecord } from './ReturnFunds';

interface ReturnFundsSummaryProps {
  records: ReturnFundRecord[];
  formatCurrency: (amount: string) => string;
}

const ReturnFundsSummary: React.FC<ReturnFundsSummaryProps> = ({ records, formatCurrency }) => {
  const totalReturned = records
    .filter(record => record.status === 'Completed')
    .reduce((sum, record) => sum + parseFloat(record.returnAmount), 0);

  const pendingReturns = records.filter(record => record.status === 'Pending').length;
  const processingReturns = records.filter(record => record.status === 'Processing').length;
  const completedReturns = records.filter(record => record.status === 'Completed').length;

  const summaryCards = [
    {
      title: 'Total Returned',
      value: `₹${formatCurrency(totalReturned.toString())}`,
      icon: TrendingDown,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Returns',
      value: pendingReturns.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Processing',
      value: processingReturns.toString(),
      icon: ArrowLeftRight,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: completedReturns.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
            {card.title === 'Total Returned' && (
              <p className="text-xs text-muted-foreground mt-1">
                Funds successfully returned to SNA
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReturnFundsSummary;
