'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Plus } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';

export function GoalList() {
  const { goals, setGoals } = useAppStore();
  const [updatingGoal, setUpdatingGoal] = useState<string | null>(null);
  const [updateAmount, setUpdateAmount] = useState('');

  const handleUpdateProgress = async (goalId: string, currentSaved: number) => {
    if (!updateAmount) return;

    setUpdatingGoal(goalId);
    try {
      const newAmount = currentSaved + parseFloat(updateAmount);
      
      const { data, error } = await supabase
        .from('goals')
        .update({ saved_amount: newAmount })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;

      setGoals(goals.map(goal => goal.id === goalId ? data : goal));
      setUpdateAmount('');
    } catch (error) {
      console.error('Error updating goal:', error);
    } finally {
      setUpdatingGoal(null);
    }
  };

  const getGoalStatus = (deadline: string, progress: number) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    
    if (progress >= 100) return { status: 'completed', color: 'text-green-600' };
    if (isBefore(deadlineDate, today)) return { status: 'overdue', color: 'text-red-600' };
    return { status: 'active', color: 'text-blue-600' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Savings Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No savings goals yet. Create your first goal!
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => {
              const progress = (goal.saved_amount / goal.target_amount) * 100;
              const { status, color } = getGoalStatus(goal.deadline, progress);
              
              return (
                <div key={goal.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${goal.saved_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(goal.deadline), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${color}`}>
                      {status === 'completed' && 'Completed!'}
                      {status === 'overdue' && 'Overdue'}
                      {status === 'active' && `${progress.toFixed(1)}%`}
                    </div>
                  </div>

                  <Progress value={Math.min(progress, 100)} className="h-2" />

                  {status !== 'completed' && (
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Add amount"
                        value={updateAmount}
                        onChange={(e) => setUpdateAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleUpdateProgress(goal.id, goal.saved_amount)}
                        disabled={!updateAmount || updatingGoal === goal.id}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {updatingGoal === goal.id ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}