'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface Transaction {
    id: number;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: string;
    category_name: string | null;
}

interface TransactionTableProps {
    transactions: Transaction[];
    showActions?: boolean;
}

export default function TransactionTable({ transactions, showActions = true }: TransactionTableProps) {
    const router = useRouter();

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            const res = await fetch(`/api/transactions?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete transaction');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting transaction');
        }
    };

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            {showActions && <th className="px-6 py-4 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={showActions ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(t.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{t.description}</td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">
                                            {t.category_name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                    </td>
                                    {showActions && (
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
