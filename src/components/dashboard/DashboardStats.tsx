'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';

export function DashboardStats() {
  const { totalIncome, totalExpenses, balance, goals } = useAppStore();

  const income = totalIncome();
  const expenses = totalExpenses();
  const currentBalance = balance();
  const activeGoals = goals.filter(goal => goal.saved_amount < goal.target_amount).length;

  const stats = [
    {
      title: 'Total Income',
      value: `$${income.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Expenses',
      value: `$${expenses.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Current Balance',
      value: `$${currentBalance.toLocaleString()}`,
      icon: Wallet,
      color: currentBalance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: currentBalance >= 0 ? 'bg-blue-50' : 'bg-red-50',
    },
    {
      title: 'Active Goals',
      value: activeGoals.toString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}