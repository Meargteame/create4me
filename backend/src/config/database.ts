import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/create4me';
    
    await mongoose.connect(dbUrl);
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
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
