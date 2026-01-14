'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, PieChart, BarChart3, Wallet } from 'lucide-react';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Categories', href: '/categories', icon: PieChart },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full glass-card border-b border-slate-200/50 my-4 mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500">
                        FinTrack
                    </span>
                </div>

                <div className="hidden md:flex space-x-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <ThemeToggle />
            </div>
        </nav>
    );
}
