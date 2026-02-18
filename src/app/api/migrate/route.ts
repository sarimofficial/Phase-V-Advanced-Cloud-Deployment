import { auth } from '@/lib/auth-server';
import { getMigrations } from 'better-auth/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('Starting database migration...');

        const { runMigrations } = await getMigrations({
            database: auth.options.database,
        });

        await runMigrations();

        console.log('Migration completed successfully!');

        return NextResponse.json({
            success: true,
            message: 'Database tables created successfully!'
        });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
