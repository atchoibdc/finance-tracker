import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT t.id, t.amount, t.type, t.description, t.date, c.name as category_name, t.category_id
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.date DESC, t.id DESC
    `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, type, category_id, description, date } = body;

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO transactions (amount, type, category_id, description, date) VALUES (?, ?, ?, ?, ?)',
            [amount, type, category_id, description, date]
        );

        return NextResponse.json({ id: result.insertId, ...body }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
        }

        await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
