// Script to add database indexes for better performance
// Run with: node backend/src/scripts/addIndexes.js

const mongoose = require('mongoose');
require('dotenv').config();

async function addIndexes() {
    try {
        await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/create4me');
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        console.log('\n📊 Adding database indexes...\n');

        // Campaign indexes
        console.log('Adding Campaign indexes...');
        await db.collection('campaigns').createIndex({ title: 'text', description: 'text' });
        await db.collection('campaigns').createIndex({ status: 1, createdAt: -1 });
        await db.collection('campaigns').createIndex({ userId: 1, status: 1 });
        await db.collection('campaigns').createIndex({ category: 1 });
        console.log('✅ Campaign indexes added');

        // CreatorProfile indexes
        console.log('Adding CreatorProfile indexes...');
        await db.collection('creatorprofiles').createIndex({ displayName: 'text', bio: 'text' });
        await db.collection('creatorprofiles').createIndex({ category: 1, rating: -1 });
        await db.collection('creatorprofiles').createIndex({ isAvailable: 1, isVerified: 1 });
        await db.collection('creatorprofiles').createIndex({ platforms: 1 });
        console.log('✅ CreatorProfile indexes added');

        // Application indexes
        console.log('Adding Application indexes...');
        await db.collection('applications').createIndex({ campaignId: 1, status: 1 });
        await db.collection('applications').createIndex({ creatorId: 1, createdAt: -1 });
        console.log('✅ Application indexes added');

        // Message indexes
        console.log('Adding Message indexes...');
        try {
            await db.collection('messages').createIndex({ senderId: 1, receiverId: 1, createdAt: -1 });
            await db.collection('messages').createIndex({ receiverId: 1, read: 1 });
            console.log('✅ Message indexes added');
        } catch (error) {
            console.log('⏭️  Message collection not found or indexes already exist');
        }

        console.log('\n✨ All indexes added successfully!');

        // List all indexes
        console.log('\n📋 Current indexes:');
        const collections = ['campaigns', 'creatorprofiles', 'applications', 'users'];
        for (const collName of collections) {
            const indexes = await db.collection(collName).indexes();
            console.log(`\n${collName}:`);
            indexes.forEach(idx => {
                console.log(`  - ${JSON.stringify(idx.key)}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addIndexes();
