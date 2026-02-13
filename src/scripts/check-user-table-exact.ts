
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function check() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        const res = await client.query('SELECT table_schema, column_name, data_type FROM information_schema.columns WHERE table_name = \'user\' AND table_schema = \'public\'');
        console.log('User Columns (public):', res.rows);
        await client.end();
    } catch (err) {
        console.error('DB Error:', err);
    }
}

check();
