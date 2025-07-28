'use client';

import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { LogOut, DollarSign } from 'lucide-react';

export function Header() {
  const { user } = useAppStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FinMate</h1>
            <p className="text-sm text-gray-500">Personal Finance</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <p className="text-sm text-gray-600">Welcome back!</p>
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}