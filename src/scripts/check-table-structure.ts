import dotenv from 'dotenv';
import path from 'path';
import { Kysely } from 'kysely';
import { PostgresDialect } from 'kysely';
import pg from 'pg';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    const dialect = new PostgresDialect({ pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }) });
    const db = new Kysely({ dialect });

    // Check user table structure
    const userColumns = await db.executeQuery({
        sql: 'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'user\' ORDER BY ordinal_position',
        parameters: []
    });
    console.log('User table columns in DB:');
    userColumns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
}

check();
