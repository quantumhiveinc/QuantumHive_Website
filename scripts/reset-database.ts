import mongoose, { Schema, model, connect, disconnect } from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Blog from '../src/models/Blog';
import CaseStudy from '../src/models/CaseStudy';
import Category from '../src/models/Category';
import Image from '../src/models/Image';
import Industry from '../src/models/Industry';
import Lead from '../src/models/Lead';
import Service from '../src/models/Service';
import Setting from '../src/models/Setting';
import Tag from '../src/models/Tag';

// Load environment variables from .env file
dotenv.config();

// Define the User schema
interface IUser extends mongoose.Document {
  username: string;
  password?: string; // Make password optional as it's selected: false by default
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude password from query results by default
  },
}, {
  collection: 'users', // Explicitly set the collection name
  timestamps: true, // Add createdAt and updatedAt timestamps
});

// Create the User model
// Use mongoose.models.User if it already exists to prevent OverwriteModelError in HMR environments
const User = mongoose.models.User || model<IUser>('User', userSchema);

const SALT_ROUNDS = 10;

async function resetDatabase() {
  const dbUrl = process.env.PROD_DATABASE_URL;

  if (!dbUrl) {
    console.error('Error: PROD_DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  console.log(`Attempting to connect to MongoDB using URL: ${dbUrl}`); // Added log
  try {
    // Explicitly set the database name in connection options
    await connect(dbUrl, { dbName: 'website_db' });
    console.log('Successfully connected to MongoDB (Database: website_db).');

    console.log('Retrieving existing collections...');
    if (!mongoose.connection.db) {
      console.error('Database connection is not available.');
      throw new Error('Database connection not available');
    }
    const collections = await mongoose.connection.db.listCollections().toArray();

    if (collections.length > 0) {
      console.log('Dropping existing collections:');
      for (const collection of collections) {
        // Avoid dropping system collections if any exist (though typically not needed for user dbs)
        if (!collection.name.startsWith('system.')) {
          try {
            // Ensure db connection is still valid before dropping
            // Ensure db connection is still valid before dropping (redundant check now, but safe)
            if (!mongoose.connection.db) {
               console.error('Database connection lost before dropping collection.');
               throw new Error('Database connection lost');
            }
            await mongoose.connection.db.dropCollection(collection.name);
            console.log(`- Dropped collection: ${collection.name}`);
          } catch (dropError: unknown) {
            // Handle cases where dropping might fail (e.g., index creation in progress)
            const message = dropError instanceof Error ? dropError.message : String(dropError);
            console.error(`- Failed to drop collection ${collection.name}:`, message);
          }
        }
      }
    } else {
      console.log('No existing collections found to drop.');
    }

    // Ensure required collections exist
    console.log('Ensuring required project collections exist...');
    const requiredModels = [
      { name: 'blogs', model: Blog },
      { name: 'casestudies', model: CaseStudy },
      { name: 'categories', model: Category },
      { name: 'images', model: Image },
      { name: 'industries', model: Industry },
      { name: 'leads', model: Lead },
      { name: 'services', model: Service },
      { name: 'settings', model: Setting },
      { name: 'tags', model: Tag },
      // Note: 'users' collection is implicitly created by the User model/admin creation
    ];

    for (const { name, model } of requiredModels) {
      try {
        // Check if the model has the createCollection method (it should for Mongoose models)
        if (typeof model.createCollection === 'function') {
            await model.createCollection();
            console.log(`- Ensured collection exists: ${name}`);
        } else {
            console.warn(`- Model for collection ${name} does not have createCollection method.`);
        }
      } catch (createError: unknown) {
        // Mongoose createCollection might not throw if it exists, but log potential issues.
        const message = createError instanceof Error ? createError.message : String(createError);
        // Define a type for potential MongoDB errors with codeName
        type MongoError = { codeName?: string; code?: number };

        // Check if the error is just that the collection already exists (codeName: NamespaceExists)
        // Use a type guard or assertion to safely access potential properties
        if (typeof createError === 'object' && createError !== null && (createError as MongoError).codeName === 'NamespaceExists') {
             console.log(`- Collection ${name} already exists (or creation attempt was benign).`);
        } else {
            console.warn(`- Warning ensuring collection ${name}: ${message}`);
        }
      }
    }

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('password', SALT_ROUNDS);

    const adminUser = new User({
      username: 'admin',
      password: hashedPassword,
    });

    await adminUser.save();
    console.log('Admin user created successfully.');

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('An error occurred during database reset:', message);
    // Consider more specific error handling if needed
  } finally {
    console.log('Disconnecting from MongoDB...');
    try {
      await disconnect();
      console.log('Successfully disconnected from MongoDB.');
      process.exit(0); // Exit successfully after disconnect
    } catch (disconnectError: unknown) {
      const message = disconnectError instanceof Error ? disconnectError.message : String(disconnectError);
      console.error('Error disconnecting from MongoDB:', message);
      process.exit(1); // Exit with error code if disconnect fails
    }
  }
}

// Execute the reset function
resetDatabase();