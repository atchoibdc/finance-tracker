'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, FileText, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

export default function TransactionForm({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense' as 'income' | 'expense',
        category_id: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to create transaction');

            router.refresh(); // Refresh server components
            router.push('/transactions');
        } catch (error) {
            console.error(error);
            alert('Error creating transaction');
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(c => c.type === formData.type);

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/transactions" className="inline-flex items-center text-slate-500 hover:text-slate-700 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Transactions
            </Link>

            <div className="glass-card p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Transaction</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type Selection */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-slate-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
                            className={`py-2 rounded-lg font-medium transition-all ${formData.type === 'income'
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
                            className={`py-2 rounded-lg font-medium transition-all ${formData.type === 'expense'
                                ? 'bg-white text-rose-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Expense
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₱</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="input-field pl-10 text-lg"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                required
                                className="input-field pl-10 appearance-none"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {filteredCategories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="date"
                                required
                                className="input-field pl-10"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                className="input-field pl-10"
                                placeholder="Enter description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
}
