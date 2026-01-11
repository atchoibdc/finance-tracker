import pool from './db';
import { RowDataPacket } from 'mysql2';

export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
}

export interface Transaction {
    id: number;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    date: string;
    category_name: string | null;
    category_id?: number;
}

export interface CategoryData {
    name: string;
    value: number;
}

export async function getSummary() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT type, SUM(amount) as total FROM transactions GROUP BY type');
    let income = 0;
    let expense = 0;
    rows.forEach(row => {
        if (row.type === 'income') income = Number(row.total);
        if (row.type === 'expense') expense = Number(row.total);
    });
    return { income, expense, balance: income - expense };
}

export async function getRecentTransactions(): Promise<Transaction[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT t.id, t.amount, t.type, t.description, t.date, c.name as category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC, t.id DESC
      LIMIT 5
    `);

    return rows.map(row => ({
        id: row.id,
        amount: Number(row.amount),
        type: row.type,
        description: row.description,
        date: new Date(row.date).toISOString(),
        category_name: row.category_name,
        category_id: row.category_id
    }));
}

export async function getAllTransactions(): Promise<Transaction[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT t.id, t.amount, t.type, t.description, t.date, c.name as category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC, t.id DESC
    `);

    return rows.map(row => ({
        id: row.id,
        amount: Number(row.amount),
        type: row.type,
        description: row.description,
        date: new Date(row.date).toISOString(),
        category_name: row.category_name,
        category_id: row.category_id
    }));
}

export async function getExpensesByCategory(): Promise<CategoryData[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT c.name, SUM(t.amount) as value
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.type = 'expense'
      GROUP BY c.name
      ORDER BY value DESC
    `);
    return rows.map(row => ({
        name: row.name as string,
        value: Number(row.value)
    }));
}

export async function getCategories(): Promise<Category[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories ORDER BY type, name');
    return rows.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type
    }));
}
