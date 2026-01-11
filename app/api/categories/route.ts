import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories ORDER BY type, name');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, type } = await request.json();
        if (!name || !type) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const [result] = await pool.query('INSERT INTO categories (name, type) VALUES (?, ?)', [name, type]);
        // @ts-ignore
        return NextResponse.json({ id: result.insertId, name, type }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
