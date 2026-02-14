import { auth } from './src/lib/auth-server';
import { getMigrations } from 'better-auth/db';

async function runMigration() {
    try {
        console.log('Starting database migration...');

        const { runMigrations } = await getMigrations({
            database: auth.options.database,
        });

        await runMigrations();

        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
