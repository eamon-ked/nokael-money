import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  notes: string;
  created_at: string;
}

interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  deadline: string;
  created_at: string;
}

interface Loan {
  id: string;
  lender_id: string;
  borrower_email: string;
  amount: number;
  interest_rate: number;
  due_date: string;
  status: 'pending' | 'accepted' | 'repaid';
  notes: string;
  created_at: string;
}

interface AppState {
  user: User | null;
  transactions: Transaction[];
  goals: Goal[];
  loans: Loan[];
  loading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setGoals: (goals: Goal[]) => void;
  setLoans: (loans: Loan[]) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed values
  totalIncome: () => number;
  totalExpenses: () => number;
  balance: () => number;
  expensesByCategory: () => Record<string, number>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  transactions: [],
  goals: [],
  loans: [],
  loading: false,
  
  setUser: (user) => set({ user }),
  setTransactions: (transactions) => set({ transactions }),
  setGoals: (goals) => set({ goals }),
  setLoans: (loans) => set({ loans }),
  setLoading: (loading) => set({ loading }),
  
  totalIncome: () => {
    const { transactions } = get();
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  },
  
  totalExpenses: () => {
    const { transactions } = get();
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  },
  
  balance: () => {
    const { totalIncome, totalExpenses } = get();
    return totalIncome() - totalExpenses();
  },
  
  expensesByCategory: () => {
    const { transactions } = get();
    const expenses = transactions.filter(t => t.type === 'expense');
    return expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  },
}));