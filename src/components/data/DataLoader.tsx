'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';

export function DataLoader() {
  const { user, setTransactions, setGoals, setLoans } = useAppStore();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Load transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (transactions) {
          setTransactions(transactions);
        }

        // Load goals
        const { data: goals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (goals) {
          setGoals(goals);
        }

        // Load loans
        const { data: loans } = await supabase
          .from('loans')
          .select('*')
          .or(`lender_id.eq.${user.id},borrower_email.eq.${user.email}`)
          .order('created_at', { ascending: false });

        if (loans) {
          setLoans(loans);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [user, setTransactions, setGoals, setLoans]);

  return null;
}