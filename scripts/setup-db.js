require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function main() {
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const database = process.env.MYSQL_DATABASE || 'finance_tracker';

    console.log(`Connecting to MySQL at ${host}...`);

    try {
        const connection = await mysql.createConnection({
            host,
            user,
            password,
        });

        console.log('Creating database if not exists...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await connection.query(`USE \`${database}\``);

        console.log('Creating tables...');

        // Users
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Categories
        await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        type ENUM('income', 'expense'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Transactions
        await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(10,2),
        type ENUM('income', 'expense'),
        category_id INT,
        description VARCHAR(255),
        date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

        // Seed some categories if empty
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM categories');
        if (rows[0].count === 0) {
            console.log('Seeding default categories...');
            const defaultCategories = [
                ['Salary', 'income'],
                ['Freelance', 'income'],
                ['Food', 'expense'],
                ['Rent', 'expense'],
                ['Transport', 'expense'],
                ['Entertainment', 'expense'],
                ['Utilities', 'expense']
            ];
            await connection.query('INSERT INTO categories (name, type) VALUES ?', [defaultCategories]);
        }

        console.log('Database setup completed successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

main();
