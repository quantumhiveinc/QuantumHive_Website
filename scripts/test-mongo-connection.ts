// Load environment variables from .env file
import 'dotenv/config'; // Load environment variables from .env file

import mongoose from 'mongoose';
import dbConnect from '../src/lib/mongoose';

async function testConnection() {
  console.log('Attempting to connect to MongoDB...');
  try {
    // Adjust the call if needed based on how dbConnect is exported/required
    // dbConnect is now imported as the default export
    await dbConnect();
    console.log('Successfully connected to MongoDB.');
    // Optional: Perform a simple operation like listing collections
    // const collections = await mongoose.connection.db.listCollections().toArray();
    // console.log('Collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit with error code
  } finally {
    // Ensure the connection is closed after the test
    try {
      await mongoose.disconnect();
      console.log('MongoDB connection closed.');
    } catch (disconnectError) {
      console.error('Failed to close MongoDB connection:', disconnectError);
      process.exit(1); // Exit with error code even if closing fails
    }
  }
}

testConnection();