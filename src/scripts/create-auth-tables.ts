import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function createTables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Create user table (user is a reserved keyword, so we quote it)
        await client.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                emailVerified BOOLEAN DEFAULT FALSE,
                name TEXT NOT NULL,
                image TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created/verified user table');

        // Create account table
        await client.query(`
            CREATE TABLE IF NOT EXISTS account (
                id TEXT PRIMARY KEY,
                providerId TEXT NOT NULL,
                accountId TEXT NOT NULL,
                userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                accessToken TEXT,
                refreshToken TEXT,
                idToken TEXT,
                accessTokenExpiresAt TIMESTAMP,
                refreshTokenExpiresAt TIMESTAMP,
                scope TEXT,
                password TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created/verified account table');

        // Create session table
        await client.query(`
            CREATE TABLE IF NOT EXISTS session (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                expiresAt TIMESTAMP NOT NULL,
                token TEXT NOT NULL UNIQUE,
                ipAddress TEXT,
                userAgent TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created/verified session table');

        // Create verification table (for email verification)
        await client.query(`
            CREATE TABLE IF NOT EXISTS verification (
                id TEXT PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                expiresAt TIMESTAMP NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created/verified verification table');

        console.log('\n✅ All tables created successfully!');

        // Verify tables
        const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
        console.log('\nCurrent tables:', res.rows.map(r => r.table_name));

    } catch (err) {
        console.error('Error creating tables:', err);
        throw err;
    } finally {
        await client.end();
    }
}

createTables();
