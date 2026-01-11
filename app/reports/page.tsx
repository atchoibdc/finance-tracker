import { getExpensesByCategory, getSummary } from '@/lib/data';
import { ExpensePieChart } from '@/components/Charts';
import SummaryCards from '@/components/SummaryCards';

export const revalidate = 0;

export default async function ReportsPage() {
    const summary = await getSummary();
    // @ts-ignore
    const expensesByCategory = await getExpensesByCategory();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                    Reports & Analytics
                </h1>
                <p className="text-slate-500 mt-1">Visualize your spending habits.</p>
            </div>

            <SummaryCards
                income={summary.income}
                expense={summary.expense}
                balance={summary.balance}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Expense Distribution</h3>
                    <ExpensePieChart data={expensesByCategory} />
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Category Breakdown</h3>
                    <div className="space-y-4">
                        {expensesByCategory.map((cat: any) => (
                            <div key={cat.name} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <span className="font-medium text-slate-700">{cat.name}</span>
                                <div className="text-right">
                                    <div className="font-bold text-slate-800">${cat.value.toLocaleString()}</div>
                                    <div className="text-xs text-slate-400">
                                        {Math.round((cat.value / summary.expense) * 100)}% of expenses
                                    </div>
                                </div>
                            </div>
                        ))}
                        {expensesByCategory.length === 0 && (
                            <p className="text-slate-500">No expense data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
