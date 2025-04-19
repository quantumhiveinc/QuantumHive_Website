import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt, EncryptionError, DecryptionError } from '@/lib/encryption'; // Import from utility

const prisma = new PrismaClient();

// Define which keys should be encrypted/decrypted
const SENSITIVE_KEYS = ['unsplash_access_key', 'unsplash_secret_key'];

export async function POST(request: Request) {
    const session = await auth();

    // 1. Authentication Check
    if (!session || !session.user) { // TODO: Add role check
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismaConnected = true; // Flag to track connection state
    try {
        const body = await request.json();
        const { category, ...settingsToSave } = body;

        if (!category || typeof category !== 'string') {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        if (Object.keys(settingsToSave).length === 0) {
            return NextResponse.json({ error: 'No settings provided to save' }, { status: 400 });
        }

        // 2. Prepare data for upsert
        const operations = Object.entries(settingsToSave).map(([key, value]) => {
            if (typeof value !== 'string') {
                console.warn(`Skipping non-string value for key: ${key}`);
                return null;
            }

            // Use the imported encrypt function
            const finalValue = SENSITIVE_KEYS.includes(key) ? encrypt(value) : value;

            return prisma.setting.upsert({ // Use correct lowercase casing: setting
                where: { key: key },
                update: { value: finalValue, category: category },
                create: { key: key, value: finalValue, category: category },
            });
        });

        const validOperations = operations.filter(op => op !== null);

        // 3. Execute transactions
        if (validOperations.length > 0) {
            await prisma.$transaction(validOperations);
        } else {
            console.log("No valid settings operations to perform.");
        }

        return NextResponse.json({ message: 'Settings saved successfully' }, { status: 200 });

    } catch (error: unknown) {
        console.error('Failed to save settings:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        // Handle specific encryption errors
        if (error instanceof EncryptionError) {
             return NextResponse.json({ error: `Failed to encrypt setting: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        // Ensure disconnect is called only if prisma was potentially used
        if (prismaConnected) {
             try {
                 await prisma.$disconnect();
             } catch (disconnectError) {
                 console.error("Failed to disconnect Prisma:", disconnectError);
             }
        }
    }
}

// GET handler to fetch settings
export async function GET(request: NextRequest) {
    const session = await auth();

    // 1. Authentication Check
    if (!session || !session.user) { // TODO: Add role check
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismaConnected = true; // Flag to track connection state
    try {
        // Optional: Filter by category if needed, using URL query parameters
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const whereClause = category ? { category: category } : {};

        // 2. Fetch settings from DB
        const settingsFromDb = await prisma.setting.findMany({ // Use correct lowercase casing: setting
             where: whereClause,
        });

        // 3. Process and decrypt sensitive settings
        const settings: { [key: string]: string } = {};
        for (const setting of settingsFromDb) {
            if (SENSITIVE_KEYS.includes(setting.key)) {
                try {
                    // Use the imported decrypt function
                    settings[setting.key] = decrypt(setting.value);
                } catch (error: unknown) {
                    // Log decryption errors but don't expose sensitive info
                    console.error(`Failed to decrypt setting '${setting.key}':`, error);
                    // Provide a placeholder or omit the key
                    settings[setting.key] = '[DECRYPTION FAILED]';
                    // Optionally, return a specific error response if decryption failure is critical
                    // if (error instanceof DecryptionError) {
                    //     return NextResponse.json({ error: `Failed to decrypt critical setting '${setting.key}'. Check server logs and configuration.` }, { status: 500 });
                    // }
                }
            } else {
                settings[setting.key] = setting.value;
            }
        }

        return NextResponse.json(settings, { status: 200 });

    } catch (error: unknown) {
        console.error('Failed to fetch settings:', error);
         // Handle potential decryption config errors (like missing key) caught during decrypt calls
        if (error instanceof DecryptionError) {
             return NextResponse.json({ error: `Configuration error during decryption: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
         if (prismaConnected) {
             try {
                 await prisma.$disconnect();
             } catch (disconnectError) {
                 console.error("Failed to disconnect Prisma:", disconnectError);
             }
        }
    }
}