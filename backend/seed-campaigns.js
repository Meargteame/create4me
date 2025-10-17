const mongoose = require('mongoose');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/create4me';

// Define schemas inline for seeding
const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  budget: {
    min: Number,
    max: Number
  },
  deadline: Date,
  location: String,
  category: String,
  requirements: [String],
  image: String,
  status: { type: String, default: 'active' },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  applications: { type: Number, default: 0 }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['creator', 'brand', 'admin'], default: 'creator' },
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);
const User = mongoose.model('User', userSchema);

async function seedCampaigns() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Check if we already have campaigns
    const existingCampaigns = await Campaign.countDocuments();
    if (existingCampaigns > 0) {
      console.log(`ℹ️  Found ${existingCampaigns} existing campaigns. Skipping seed.`);
      console.log('   Delete campaigns manually if you want to re-seed: db.campaigns.deleteMany({})');
      await mongoose.disconnect();
      return;
    }

    // Find or create a brand user
    let brandUser = await User.findOne({ role: 'brand' });

    if (!brandUser) {
      console.log('📝 Creating sample brand user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);

      brandUser = await User.create({
        email: 'brand@example.com',
        passwordHash: hashedPassword,
        name: 'Sample Brand',
        role: 'brand',
        emailVerified: true
      });
      console.log('✅ Brand user created: brand@example.com / password123');
    }

    // Sample campaigns data
    const sampleCampaigns = [
      {
        userId: brandUser._id,
        title: 'Ethiopian Coffee Culture Campaign',
        description: 'Looking for lifestyle creators to showcase the authentic Ethiopian coffee experience. We want to highlight the traditional coffee ceremony and modern coffee culture in Ethiopia.',
        budget: { min: 8000, max: 20000 },
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'Addis Ababa',
        category: 'Lifestyle',
        requirements: ['Instagram posts (3-5)', 'Stories (10+)', 'Reel content', '50K+ followers'],
        image: '/api/placeholder/600/300',
        likes: 24,
        comments: 8,
        applications: 15,
        status: 'active'
      },
      {
        userId: brandUser._id,
        title: 'Local Fashion Brand Launch',
        description: 'New Ethiopian fashion brand launching sustainable clothing line. Seeking fashion influencers to showcase our eco-friendly designs inspired by Ethiopian culture.',
        budget: { min: 5000, max: 15000 },
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        location: 'Nationwide',
        category: 'Fashion',
        requirements: ['Fashion photography', 'Brand storytelling', 'Sustainable fashion focus'],
        likes: 18,
        comments: 12,
        applications: 8,
        status: 'active'
      },
      {
        userId: brandUser._id,
        title: 'Tech Innovation Showcase',
        description: 'Promoting Ethiopian tech startups and innovation. Looking for tech reviewers and content creators to feature emerging technologies and startups in Ethiopia.',
        budget: { min: 12000, max: 30000 },
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        location: 'Addis Ababa',
        category: 'Technology',
        requirements: ['Tech review content', 'Startup interviews', 'Innovation storytelling'],
        likes: 31,
        comments: 6,
        applications: 22,
        status: 'active'
      },
      {
        userId: brandUser._id,
        title: 'Traditional Food & Restaurant Promotion',
        description: 'Chain of traditional Ethiopian restaurants seeking food bloggers and influencers to showcase our authentic dishes and dining experience.',
        budget: { min: 6000, max: 12000 },
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Addis Ababa, Bahir Dar',
        category: 'Food',
        requirements: ['Food photography', 'Restaurant reviews', 'Video content'],
        likes: 15,
        comments: 10,
        applications: 12,
        status: 'active'
      },
      {
        userId: brandUser._id,
        title: 'Beauty & Skincare Product Launch',
        description: 'Ethiopian natural skincare brand launching new product line. Looking for beauty influencers to review and promote our products made from local ingredients.',
        budget: { min: 7000, max: 18000 },
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        location: 'Nationwide',
        category: 'Beauty',
        requirements: ['Product review videos', 'Before/after content', 'Skincare tutorials'],
        likes: 28,
        comments: 14,
        applications: 19,
        status: 'active'
      },
      {
        userId: brandUser._id,
        title: 'Fitness & Wellness Program Promotion',
        description: 'New fitness center and wellness program launching in Addis. Need fitness influencers to promote our programs and facilities.',
        budget: { min: 5000, max: 10000 },
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: 'Addis Ababa',
        category: 'Lifestyle',
        requirements: ['Workout videos', 'Transformation stories', 'Facility tours'],
        likes: 12,
        comments: 5,
        applications: 9,
        status: 'active'
      },
      {
        userId: brandUser._id,
        title: 'Ethiopian Tourism Campaign',
        description: 'National tourism board seeking travel creators to showcase Ethiopia\'s historic sites, natural beauty, and cultural heritage to international audiences.',
        budget: { min: 15000, max: 40000 },
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        location: 'Various Locations',
        category: 'Travel',
        requirements: ['Travel vlogs', 'Photography', 'Cultural storytelling', 'International reach'],
        likes: 45,
        comments: 20,
        applications: 30,
        status: 'active'
      },
      {
        userId: brandUser._id,
        title: 'Music Festival Promotion',
        description: 'Upcoming Ethiopian music festival needs influencers to promote event, cover performances, and engage audiences on social media.',
        budget: { min: 8000, max: 16000 },
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Addis Ababa',
        category: 'Entertainment',
        requirements: ['Event coverage', 'Behind-the-scenes content', 'Live streaming'],
        likes: 38,
        comments: 15,
        applications: 25,
        status: 'active'
      }
    ];

    console.log('📝 Creating sample campaigns...');
    const createdCampaigns = await Campaign.insertMany(sampleCampaigns);

    console.log(`✅ Successfully created ${createdCampaigns.length} campaigns!`);
    console.log('\n📊 Campaign Summary:');
    console.log(`   - Total campaigns: ${createdCampaigns.length}`);
    console.log(`   - Brand user: ${brandUser.email}`);
    console.log(`   - Categories: Lifestyle, Fashion, Technology, Food, Beauty, Travel, Entertainment`);
    console.log('\n💡 You can now:');
    console.log('   1. Login as the brand user to manage campaigns');
    console.log('   2. Create a creator account to browse and apply to campaigns');
    console.log('   3. View campaigns in the feed page');

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    console.log('✨ Seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding campaigns:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedCampaigns();
