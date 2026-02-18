import { Client } from 'pg';
// @ts-nocheck
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function recreateTables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Drop existing tables
        console.log('\n🗑️  Dropping existing tables...');
        await client.query('DROP TABLE IF EXISTS verification CASCADE');
        await client.query('DROP TABLE IF EXISTS session CASCADE');
        await client.query('DROP TABLE IF EXISTS account CASCADE');
        await client.query('DROP TABLE IF EXISTS "user" CASCADE');
        console.log('✓ All tables dropped');

        // Create user table with correct column names (camelCase - must quote them!)
        await client.query(`
            CREATE TABLE "user" (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                "emailVerified" BOOLEAN DEFAULT FALSE,
                name TEXT NOT NULL,
                image TEXT,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created user table');

        // Create account table
        await client.query(`
            CREATE TABLE account (
                id TEXT PRIMARY KEY,
                "providerId" TEXT NOT NULL,
                "accountId" TEXT NOT NULL,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                "accessToken" TEXT,
                "refreshToken" TEXT,
                "idToken" TEXT,
                "accessTokenExpiresAt" TIMESTAMP,
                "refreshTokenExpiresAt" TIMESTAMP,
                scope TEXT,
                password TEXT,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created account table');

        // Create session table
        await client.query(`
            CREATE TABLE session (
                id TEXT PRIMARY KEY,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                "expiresAt" TIMESTAMP NOT NULL,
                token TEXT NOT NULL UNIQUE,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created session table');

        // Create verification table
        await client.query(`
            CREATE TABLE verification (
                id TEXT PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created verification table');

        console.log('\n✅ All tables created successfully with correct schema!');

        // Verify table structure
        const userColumns = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'user'
            ORDER BY ordinal_position
        `);
        console.log('\nUser table columns:');
        userColumns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });

    } catch (err) {
        console.error('Error recreating tables:', err);
        throw err;
    } finally {
        await client.end();
    }
}

recreateTables();
