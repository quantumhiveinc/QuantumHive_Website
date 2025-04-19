import mongoose from 'mongoose';

// Use the correct environment variable name
const DATABASE_URL = process.env.PROD_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    'Please define the PROD_DATABASE_URL environment variable inside .env' // Updated error message
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface CustomGlobal {
  mongoose: {
    conn: import("mongoose").Mongoose | null;
    promise: Promise<import("mongoose").Mongoose> | null;
  };
}

let cached = (global as unknown as CustomGlobal).mongoose;

if (!cached) {
  (global as unknown as CustomGlobal).mongoose = { conn: null, promise: null };
  cached = (global as unknown as CustomGlobal).mongoose;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(DATABASE_URL!, opts).then((mongoose) => { // Use correct variable with non-null assertion
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect