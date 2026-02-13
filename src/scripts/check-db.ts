
import { Client } from 'pg';
// @ts-nocheck
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function check() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        console.log('Connected to DB');
        const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
        console.log('Tables:', res.rows.map(r => r.table_name));
        await client.end();
    } catch (err) {
        console.error('DB Connection Error:', err);
    }
}

check();
