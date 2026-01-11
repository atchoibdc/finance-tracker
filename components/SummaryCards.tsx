import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface SummaryCardsProps {
    income: number;
    expense: number;
    balance: number;
}

export default function SummaryCards({ income, expense, balance }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <div className="glass-card p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet className="w-24 h-24 text-blue-600" />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-500 font-medium mb-1">Total Balance</p>
                    <h3 className="text-3xl font-bold text-slate-800">${balance.toLocaleString()}</h3>
                </div>
            </div>

            {/* Income Card */}
            <div className="glass-card p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowUpCircle className="w-24 h-24 text-emerald-600" />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-500 font-medium mb-1">Total Income</p>
                    <h3 className="text-3xl font-bold text-emerald-600">+${income.toLocaleString()}</h3>
                </div>
            </div>

            {/* Expense Card */}
            <div className="glass-card p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ArrowDownCircle className="w-24 h-24 text-rose-600" />
                </div>
                <div className="relative z-10">
                    <p className="text-slate-500 font-medium mb-1">Total Expenses</p>
                    <h3 className="text-3xl font-bold text-rose-600">-${expense.toLocaleString()}</h3>
                </div>
            </div>
        </div>
    );
}
