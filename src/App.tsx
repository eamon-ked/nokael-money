import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
import { DataLoader } from '@/components/data/DataLoader';

// Dashboard components
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

// Transaction components
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';

// Goal components
import { GoalForm } from '@/components/goals/GoalForm';
import { GoalList } from '@/components/goals/GoalList';

// Loan components
import { LoanForm } from '@/components/loans/LoanForm';
import { LoanList } from '@/components/loans/LoanList';

export default function App() {
  const { user, loading } = useAppStore();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DataLoader />
      {!user ? (
        <LoginForm />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <main className="flex-1 md:ml-64 p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                {activeSection === 'dashboard' && (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                      <p className="text-gray-600">Overview of your financial health</p>
                    </div>
                    <DashboardStats />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <ExpenseChart />
                      <RecentTransactions />
                    </div>
                  </div>
                )}

                {activeSection === 'transactions' && (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
                      <p className="text-gray-600">Track your income and expenses</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <TransactionForm />
                      </div>
                      <div className="lg:col-span-2">
                        <TransactionList />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'goals' && (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Goals</h1>
                      <p className="text-gray-600">Set and track your financial goals</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <GoalForm />
                      </div>
                      <div className="lg:col-span-2">
                        <GoalList />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'loans' && (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer-to-Peer Loans</h1>
                      <p className="text-gray-600">Manage lending and borrowing with friends</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-1">
                        <LoanForm />
                      </div>
                      <div className="lg:col-span-2">
                        <LoanList />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}