import { getSummary, getRecentTransactions, getExpensesByCategory } from '@/lib/data';
import SummaryCards from '@/components/SummaryCards';
import TransactionTable from '@/components/TransactionTable';
import { ExpensePieChart } from '@/components/Charts';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function Dashboard() {
  const summary = await getSummary();
  const recentTransactions = await getRecentTransactions();
  // @ts-ignore
  const expensesByCategory = await getExpensesByCategory();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400">
            Financial Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your financial health.</p>
        </div>
        <Link
          href="/transactions/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </Link>
      </div>

      {/* Stats */}
      <SummaryCards
        income={summary.income}
        expense={summary.expense}
        balance={summary.balance}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Recent Transactions</h2>
            <Link href="/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All &rarr;
            </Link>
          </div>
          <TransactionTable transactions={recentTransactions} showActions={false} />
        </div>

        {/* Categories Chart */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Expenses by Category</h2>
          <div className="glass-card p-6">
            <ExpensePieChart data={expensesByCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}
