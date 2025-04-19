import mongoose from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: mongoose.Mongoose | null
        promise: Promise<mongoose.Mongoose> | null
      }
    }
  }
}