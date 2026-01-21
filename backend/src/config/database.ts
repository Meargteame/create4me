import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDatabase = async (): Promise<void> => {
  try {
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/create4me';
    
    // Attempt standard connection first
    await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 5000 });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  Could not connect to local/provided MongoDB:', error instanceof Error ? error.message : error);

    // Fallback to In-Memory DB for development
    // We treat "test" and undefined (local dev) as environments where memory-server is okay
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Starting In-Memory MongoDB fallback for local development...');
      try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`✅ Connected to temporary In-Memory MongoDB: ${uri}`);
        console.log('ℹ️  NOTE: Data is temporary and will be lost when the server stops.');
      } catch (memError) {
        console.error('❌ Failed to start In-Memory MongoDB:', memError);
        process.exit(1);
      }
    } else {
       console.error('❌ Fatal: MongoDB connection failed in production.');
       process.exit(1);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
