'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart } from 'lucide-react';

export function LoanForm() {
  const { user, loans, setLoans } = useAppStore();
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !borrowerEmail || !amount || !dueDate) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('loans')
        .insert({
          lender_id: user.id,
          borrower_email: borrowerEmail,
          amount: parseFloat(amount),
          interest_rate: parseFloat(interestRate),
          due_date: dueDate,
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      setLoans([data, ...loans]);
      
      // Reset form
      setBorrowerEmail('');
      setAmount('');
      setInterestRate('0');
      setDueDate('');
      setNotes('');
    } catch (error) {
      console.error('Error creating loan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HandHeart className="h-5 w-5" />
          <span>Create Loan Request</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="borrowerEmail">Borrower Email</Label>
            <Input
              id="borrowerEmail"
              type="email"
              placeholder="borrower@example.com"
              value={borrowerEmail}
              onChange={(e) => setBorrowerEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Add any additional terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Loan Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}