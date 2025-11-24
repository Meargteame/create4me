import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const connect = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/create4me';
        await mongoose.connect(dbUrl);
        console.log('Connected to DB');

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

connect();
