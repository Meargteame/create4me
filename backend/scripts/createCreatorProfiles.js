// Quick script to create creator profiles for existing creator users
// Run with: node backend/scripts/createCreatorProfiles.js

const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String
});

const creatorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  bio: String,
  category: { type: String, default: 'General' },
  platforms: [String],
  socialLinks: Object,
  followers: { type: Number, default: 0 },
  engagement: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  completedCampaigns: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);

// Helper function to generate unique username
function generateUsername(email, name, index = 0) {
  const base = name
    ? name.toLowerCase().replace(/[^a-z0-9]/g, '')
    : email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  return index === 0 ? base : `${base}${index}`;
}

async function createProfiles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/create4me');
    console.log('Connected to MongoDB');

    // Find all creator users
    const creators = await User.find({ role: 'creator' });
    console.log(`Found ${creators.length} creator users`);

    let created = 0;
    let skipped = 0;

    for (const creator of creators) {
      // Check if profile already exists
      const existingProfile = await CreatorProfile.findOne({ userId: creator._id });

      if (!existingProfile) {
        // Generate unique username
        let username = generateUsername(creator.email, creator.name);
        let usernameIndex = 0;

        // Check if username already exists
        while (await CreatorProfile.findOne({ username })) {
          usernameIndex++;
          username = generateUsername(creator.email, creator.name, usernameIndex);
        }

        const profile = new CreatorProfile({
          userId: creator._id,
          username: username,
          displayName: creator.name || creator.email.split('@')[0],
          bio: `Hi, I'm ${creator.name || 'a creator'}! I'm excited to collaborate with brands.`,
          category: 'General',
          platforms: [],
          socialLinks: {},
          followers: 0,
          engagement: 0,
          rating: 0,
          completedCampaigns: 0,
          isAvailable: true,
          isVerified: false
        });

        await profile.save();
        created++;
        console.log(`✅ Created profile for ${creator.name || creator.email} (username: ${username})`);
      } else {
        skipped++;
        console.log(`⏭️  Profile already exists for ${creator.name || creator.email}`);
      }
    }

    console.log(`\n✨ Done! Created ${created} new profiles, skipped ${skipped} existing profiles.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createProfiles();
