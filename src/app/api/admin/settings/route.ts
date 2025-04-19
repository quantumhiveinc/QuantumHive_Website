import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection
import Setting, { ISetting } from '@/models/Setting'; // Import Mongoose model and interface
import { FilterQuery } from 'mongoose'; // Import FilterQuery
import { encrypt, decrypt, EncryptionError, DecryptionError } from '@/lib/encryption'; // Import from utility

// Define which keys should be encrypted/decrypted
const SENSITIVE_KEYS = ['unsplash_access_key', 'unsplash_secret_key'];

export async function POST(request: NextRequest) { // Use NextRequest for consistency
    const session = await auth();

    // 1. Authentication Check & Authorization (Assume Admin for settings)
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    try {
        await dbConnect(); // Ensure DB connection
        const body = await request.json();
        const { category, ...settingsToSave } = body;

        if (!category || typeof category !== 'string') {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        if (Object.keys(settingsToSave).length === 0) {
            return NextResponse.json({ error: 'No settings provided to save' }, { status: 400 });
        }

        // 2. Process and save settings using Mongoose findOneAndUpdate (upsert)
        const savePromises = Object.entries(settingsToSave).map(async ([key, value]) => {
            if (typeof value !== 'string') {
                console.warn(`Skipping non-string value for key: ${key}`);
                return null; // Skip non-string values
            }

            try {
                // Encrypt if sensitive
                const finalValue = SENSITIVE_KEYS.includes(key) ? encrypt(value) : value;

                // Use findOneAndUpdate with upsert: true
                await Setting.findOneAndUpdate(
                    { key: key }, // Find by key
                    { value: finalValue, category: category }, // Data to set on update/create
                    { upsert: true, new: true, runValidators: true } // Options: create if not found, return new doc, run schema validation
                );
                return key; // Return key on success
            } catch (error) {
                 // Catch errors during encryption or DB operation for a single key
                 console.error(`Failed to save setting for key "${key}":`, error);
                 // Re-throw specific errors to be caught by the outer catch block
                 if (error instanceof EncryptionError) throw error;
                 if (error instanceof Error && error.name === 'ValidationError') throw error;
                 // Throw a generic error for other DB issues related to this key
                 throw new Error(`Database operation failed for key "${key}"`);
            }
        });

        // 3. Wait for all operations to complete
        const results = await Promise.allSettled(savePromises);

        // Optional: Check results for individual failures if needed
        const failedKeys = results
            .filter(r => r.status === 'rejected')
            .map((r: PromiseRejectedResult) => r.reason?.message || 'Unknown error'); // Extract reason

        if (failedKeys.length > 0) {
             console.error("Some settings failed to save:", failedKeys);
             // Decide if partial success is acceptable or return a specific error
             // For simplicity, returning a general error if any key failed
             return NextResponse.json({ error: `Failed to save some settings. Check logs. Failures: ${failedKeys.join(', ')}` }, { status: 500 });
        }


        return NextResponse.json({ message: 'Settings saved successfully' }, { status: 200 });

    } catch (error: unknown) {
        console.error('Failed to save settings:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        // Handle specific encryption errors (might be re-thrown from the loop)
        if (error instanceof EncryptionError) {
             return NextResponse.json({ error: `Failed to encrypt setting: ${error.message}` }, { status: 500 });
        }
         // Handle Mongoose validation errors (might be re-thrown from the loop)
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json({ error: `Validation failed: ${error.message}` }, { status: 400 });
        }
        // Handle Mongoose unique constraint errors (for key)
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
             return NextResponse.json({ error: 'Setting key constraint violation.' }, { status: 409 });
        }
        // Use the error message if it was thrown from the loop
        if (error instanceof Error && error.message.startsWith('Database operation failed for key')) {
             return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error during settings update.' }, { status: 500 });
    }
    // No finally block needed for Mongoose connection management here
}

// GET handler to fetch settings
export async function GET(request: NextRequest) {
    const session = await auth();

    // 1. Authentication Check & Authorization (Assume Admin for settings)
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    try {
        await dbConnect(); // Ensure DB connection
        // Optional: Filter by category if needed, using URL query parameters
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const filter: FilterQuery<ISetting> = {}; // Use Mongoose FilterQuery
        if (category) {
            filter.category = category;
        }

        // 2. Fetch settings from DB using Mongoose
        const settingsFromDb: ISetting[] = await Setting.find(filter);

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
             // Log the specific error but return a generic message to the client
             console.error("Decryption configuration error:", error.message);
             return NextResponse.json({ error: 'Server configuration error prevented settings retrieval.' }, { status: 500 });
        }
        // Handle other potential errors during fetch
        return NextResponse.json({ error: 'Internal Server Error while fetching settings.' }, { status: 500 });
    }
    // No finally block needed for Mongoose connection management here
}