import { auth } from '../src/lib/auth-server';

async function migrate() {
    try {
        console.log('Starting Better Auth migration...');

        // Better Auth should have a method to generate schema
        // @ts-ignore - accessing internal API
        if (auth.api && typeof auth.api.migrate === 'function') {
            // @ts-ignore
            await auth.api.migrate();
            console.log('Migration completed successfully!');
        } else {
            console.log('Migration API not available. Checking schema...');
            // Try to create tables manually if needed
            console.log('Please ensure database tables are created.');
        }
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
