import { getAllTransactions } from '@/lib/data';
import TransactionTable from '@/components/TransactionTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function TransactionsPage() {
    const transactions = await getAllTransactions();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        Transactions
                    </h1>
                    <p className="text-slate-500 mt-1">Manage your income and expenses.</p>
                </div>
                <Link
                    href="/transactions/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-500/30"
                >
                    <Plus className="w-5 h-5" />
                    New Transaction
                </Link>
            </div>

            <TransactionTable transactions={transactions} showActions={true} />
        </div>
    );
}
