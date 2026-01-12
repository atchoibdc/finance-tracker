const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('Connecting to MySQL...');
  try {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    });

    const dbName = process.env.MYSQL_DATABASE;
    if (!dbName) {
        console.error('MYSQL_DATABASE is not defined in .env.local');
        process.exit(1);
    }

    console.log(`Creating database '${dbName}' if it implies doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or confirmed.`);
    
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
}

main();
