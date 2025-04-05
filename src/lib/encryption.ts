import crypto from 'crypto';

// Ensure a strong, securely stored key (e.g., in environment variables)
const ENCRYPTION_KEY_RAW = process.env.SETTINGS_ENCRYPTION_KEY;
const IV_LENGTH = 16; // For AES, this is always 16

class EncryptionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EncryptionError';
    }
}

class DecryptionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DecryptionError';
    }
}

function getEncryptionKey(): Buffer {
    if (!ENCRYPTION_KEY_RAW) {
        console.error("CRITICAL: SETTINGS_ENCRYPTION_KEY environment variable is not set.");
        throw new EncryptionError("Server configuration error: Encryption key is missing.");
    }
    if (Buffer.from(ENCRYPTION_KEY_RAW).length !== 32) {
        console.error("CRITICAL: SETTINGS_ENCRYPTION_KEY must be 32 bytes long.");
        throw new EncryptionError("Server configuration error: Invalid encryption key length.");
    }
    return Buffer.from(ENCRYPTION_KEY_RAW);
}

export function encrypt(text: string): string {
    try {
        const key = getEncryptionKey();
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let encrypted = cipher.update(text, 'utf8'); // Specify input encoding
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        // Prepend IV and AuthTag to the encrypted data for storage: IV:AuthTag:EncryptedData
        return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Encryption failed:", error);
        // Throw a specific error instead of returning plaintext
        throw new EncryptionError(`Encryption failed: ${message}`);
    }
}

export function decrypt(text: string): string {
    try {
        const key = getEncryptionKey();
        const parts = text.split(':');
        if (parts.length !== 3) {
            throw new Error("Invalid encrypted text format. Expected IV:AuthTag:Data.");
        }

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const encryptedText = Buffer.from(parts[2], 'hex');

        if (iv.length !== IV_LENGTH) {
            throw new Error(`Invalid IV length. Expected ${IV_LENGTH} bytes, got ${iv.length}.`);
        }

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText); // Input is buffer
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8'); // Specify output encoding
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Decryption failed:", error);
        // Throw a specific error instead of returning the encrypted text
        throw new DecryptionError(`Decryption failed: ${message}`);
    }
}

// Re-export errors for specific catching if needed
export { EncryptionError, DecryptionError };