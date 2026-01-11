import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Financial Tracker',
  description: 'Track your income and expenses easily.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center pb-10">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Navbar />
            <main className="mt-4 fade-in">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
