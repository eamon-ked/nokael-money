/*
# FinMate Database Schema

This migration creates the complete database schema for the FinMate personal finance application.

## Tables Created

1. **users** - User profile information
   - `id` (uuid, primary key)
   - `email` (text, unique)
   - `full_name` (text)
   - `created_at` (timestamp)

2. **transactions** - Income and expense tracking
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to users)
   - `type` (text, 'income' or 'expense')
   - `category` (text)
   - `amount` (decimal)
   - `date` (date)
   - `notes` (text)
   - `created_at` (timestamp)

3. **goals** - Savings goals management
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key to users)
   - `name` (text)
   - `target_amount` (decimal)
   - `saved_amount` (decimal, default 0)
   - `deadline` (date)
   - `created_at` (timestamp)

4. **loans** - Peer-to-peer lending
   - `id` (uuid, primary key)
   - `lender_id` (uuid, foreign key to users)
   - `borrower_email` (text)
   - `amount` (decimal)
   - `interest_rate` (decimal, default 0)
   - `due_date` (date)
   - `status` (text, 'pending', 'accepted', 'repaid')
   - `notes` (text)
   - `created_at` (timestamp)

## Security

- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own data
- Authentication required for all operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  amount decimal(10,2) NOT NULL,
  date date NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount decimal(10,2) NOT NULL,
  saved_amount decimal(10,2) DEFAULT 0,
  deadline date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  borrower_email text NOT NULL,
  amount decimal(10,2) NOT NULL,
  interest_rate decimal(5,2) DEFAULT 0,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'repaid')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for transactions
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for goals
CREATE POLICY "Users can read own goals" ON goals
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for loans
CREATE POLICY "Users can read loans they're involved in" ON loans
  FOR SELECT TO authenticated
  USING (auth.uid() = lender_id OR borrower_email = (SELECT email FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert loans they're lending" ON loans
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = lender_id);

CREATE POLICY "Users can update loans they're involved in" ON loans
  FOR UPDATE TO authenticated
  USING (auth.uid() = lender_id OR borrower_email = (SELECT email FROM users WHERE id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_lender_id ON loans(lender_id);
CREATE INDEX IF NOT EXISTS idx_loans_borrower_email ON loans(borrower_email);