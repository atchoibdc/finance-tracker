import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        // 1. Total Income & Expense
        const [summaryRows] = await pool.query<RowDataPacket[]>(`
      SELECT type, SUM(amount) as total 
      FROM transactions 
      GROUP BY type
    `);

        let income = 0;
        let expense = 0;

        summaryRows.forEach(row => {
            if (row.type === 'income') income = Number(row.total);
            if (row.type === 'expense') expense = Number(row.total);
        });

        const balance = income - expense;

        // 2. Spending by Category (Expenses only)
        const [categoryRows] = await pool.query<RowDataPacket[]>(`
      SELECT c.name, SUM(t.amount) as value
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.type = 'expense'
      GROUP BY c.name
      ORDER BY value DESC
    `);

        // 3. Last 5 Transactions
        const [recentRows] = await pool.query<RowDataPacket[]>(`
      SELECT t.id, t.amount, t.type, t.description, t.date, c.name as category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC
      LIMIT 5
    `);

        return NextResponse.json({
            summary: { income, expense, balance },
            byCategory: categoryRows,
            recentTransactions: recentRows
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
