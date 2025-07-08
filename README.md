# FinMate - Personal Finance App

A modern, full-featured personal finance application built with Next.js, TypeScript, and Supabase.

## Features

- **💰 Expense & Income Tracking**: Categorize and track all your financial transactions
- **🎯 Savings Goals**: Set and monitor progress toward your financial goals
- **🤝 Peer-to-Peer Loans**: Manage lending and borrowing with friends and family
- **📊 Visual Analytics**: Charts and insights to understand your spending patterns
- **🔐 Secure Authentication**: Email/password authentication with Supabase
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 13, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Row-Level Security)
- **State Management**: Zustand
- **Charts**: Recharts
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finmate
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your URL and anon key
   - Copy `.env.example` to `.env.local` and add your Supabase credentials

4. Run the database migrations:
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Copy and paste the content from `supabase/migrations/create_finmate_schema.sql`
   - Run the migration

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app router
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── transactions/     # Transaction management
│   ├── goals/           # Savings goals
│   ├── loans/           # Peer-to-peer loans
│   └── layout/          # Layout components
├── lib/                  # Utilities and configurations
│   ├── supabase.ts      # Supabase client
│   ├── store.ts         # Zustand store
│   └── constants.ts     # App constants
├── supabase/            # Database migrations
└── public/              # Static assets
```

## Database Schema

### Tables

- **users**: User profiles and authentication
- **transactions**: Income and expense records
- **goals**: Savings goals and progress tracking
- **loans**: Peer-to-peer lending records

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication with Supabase Auth

## Features Overview

### Dashboard
- Financial overview with income, expenses, and balance
- Expense breakdown by category (pie chart)
- Recent transactions summary
- Active savings goals count

### Transactions
- Add income and expense entries
- Categorization with predefined categories
- Search and filter functionality
- Visual indicators for income vs expenses

### Savings Goals
- Create and track savings goals
- Progress bars and completion percentages
- Deadline tracking with status indicators
- Manual progress updates

### Peer-to-Peer Loans
- Create loan requests with terms
- Accept/decline loan requests
- Track loan status (pending, accepted, repaid)
- Interest rate calculations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.