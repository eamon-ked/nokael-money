'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Mail, Percent } from 'lucide-react';
import { format } from 'date-fns';
import { LOAN_STATUS_COLORS } from '@/lib/constants';

export function LoanList() {
  const { user, loans, setLoans } = useAppStore();
  const [updatingLoan, setUpdatingLoan] = useState<string | null>(null);

  const handleStatusUpdate = async (loanId: string, newStatus: 'accepted' | 'repaid') => {
    setUpdatingLoan(loanId);
    try {
      const { data, error } = await supabase
        .from('loans')
        .update({ status: newStatus })
        .eq('id', loanId)
        .select()
        .single();

      if (error) throw error;

      setLoans(loans.map(loan => loan.id === loanId ? data : loan));
    } catch (error) {
      console.error('Error updating loan:', error);
    } finally {
      setUpdatingLoan(null);
    }
  };

  const isLender = (loan: any) => loan.lender_id === user?.id;
  const isBorrower = (loan: any) => loan.borrower_email === user?.email;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No loans yet. Create your first loan request!
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={LOAN_STATUS_COLORS[loan.status as keyof typeof LOAN_STATUS_COLORS]}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {isLender(loan) ? 'You are lending' : 'You are borrowing'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${loan.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Percent className="h-4 w-4" />
                        <span>{loan.interest_rate}% interest</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{isLender(loan) ? loan.borrower_email : 'From lender'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {format(new Date(loan.due_date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>

                    {loan.notes && (
                      <p className="text-sm text-gray-500 italic">"{loan.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {loan.status === 'pending' && isBorrower(loan) && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(loan.id, 'accepted')}
                      disabled={updatingLoan === loan.id}
                    >
                      {updatingLoan === loan.id ? 'Accepting...' : 'Accept Loan'}
                    </Button>
                  )}
                  
                  {loan.status === 'accepted' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(loan.id, 'repaid')}
                      disabled={updatingLoan === loan.id}
                    >
                      {updatingLoan === loan.id ? 'Marking...' : 'Mark as Repaid'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}