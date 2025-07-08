import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qzdnpbnliwgnlfhaejky.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZG5wYm5saXdnbmxmaGFlamt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NDgwOTQsImV4cCI6MjA2NzUyNDA5NH0.FSz9vtkP3j8T4R-4tuf__fUBAmq5jj2gzWQ9fppxl8E';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'income' | 'expense';
          category: string;
          amount: number;
          date: string;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'income' | 'expense';
          category: string;
          amount: number;
          date: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'income' | 'expense';
          category?: string;
          amount?: number;
          date?: string;
          notes?: string;
          created_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          saved_amount: number;
          deadline: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          saved_amount?: number;
          deadline: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          saved_amount?: number;
          deadline?: string;
          created_at?: string;
        };
      };
      loans: {
        Row: {
          id: string;
          lender_id: string;
          borrower_email: string;
          amount: number;
          interest_rate: number;
          due_date: string;
          status: 'pending' | 'accepted' | 'repaid';
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lender_id: string;
          borrower_email: string;
          amount: number;
          interest_rate?: number;
          due_date: string;
          status?: 'pending' | 'accepted' | 'repaid';
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lender_id?: string;
          borrower_email?: string;
          amount?: number;
          interest_rate?: number;
          due_date?: string;
          status?: 'pending' | 'accepted' | 'repaid';
          notes?: string;
          created_at?: string;
        };
      };
    };
  };
};