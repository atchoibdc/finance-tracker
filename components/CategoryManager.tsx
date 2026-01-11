'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Tag, Layers } from 'lucide-react';
import clsx from 'clsx';

interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const router = useRouter();
    const [categories, setCategories] = useState(initialCategories);
    const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' as 'income' | 'expense' });
    const [loading, setLoading] = useState(false);

    // Group categories
    const incomeCategories = categories.filter(c => c.type === 'income');
    const expenseCategories = categories.filter(c => c.type === 'expense');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.name) return;
        setLoading(true);

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory),
            });

            if (!res.ok) throw new Error('Failed');

            const created = await res.json();
            setCategories([...categories, created]); // Optimistic-ish update (using server response)
            setNewCategory({ ...newCategory, name: '' });
            router.refresh();
        } catch (error) {
            alert('Error adding category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category List */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <Tag className="w-5 h-5" />
                        </span>
                        Income Categories
                    </h2>
                    <div className="space-y-2">
                        {incomeCategories.map(c => (
                            <div key={c.id} className="glass-card px-4 py-3 flex justify-between items-center group">
                                <span className="font-medium text-slate-700">{c.name}</span>
                                {/* Delete not implemented in API yet, usually requires check if transactions exist */}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <span className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <Layers className="w-5 h-5" />
                        </span>
                        Expense Categories
                    </h2>
                    <div className="space-y-2">
                        {expenseCategories.map(c => (
                            <div key={c.id} className="glass-card px-4 py-3 flex justify-between items-center group">
                                <span className="font-medium text-slate-700">{c.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Form */}
            <div>
                <div className="glass-card p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Category</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
                            <input
                                className="input-field"
                                placeholder="e.g. Freelance, Groceries"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                                    className={clsx(
                                        "flex-1 py-2 rounded-lg font-medium transition-all",
                                        newCategory.type === 'income'
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    )}
                                >
                                    Income
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                                    className={clsx(
                                        "flex-1 py-2 rounded-lg font-medium transition-all",
                                        newCategory.type === 'expense'
                                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    )}
                                >
                                    Expense
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newCategory.name}
                            className="w-full btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding...' : 'Add Category'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
