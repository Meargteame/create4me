import prisma from './prisma';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    await prisma.campaignApplication.deleteMany();
    await prisma.creatorProfile.deleteMany();
    await prisma.connection.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create brand users
    const brand1 = await prisma.user.create({
      data: {
        email: 'ethiocoffee@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'brand',
        name: 'Ethiopian Coffee Co.',
      },
    });

    const brand2 = await prisma.user.create({
      data: {
        email: 'addisfashion@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'brand',
        name: 'Addis Fashion House',
      },
    });

    const brand3 = await prisma.user.create({
      data: {
        email: 'techhub@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'brand',
        name: 'Tech Hub Ethiopia',
      },
    });

    console.log('✅ Created 3 brand users');

    // Create creator users
    const creator1 = await prisma.user.create({
      data: {
        email: 'hanan@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'creator',
        name: 'Hanan Ahmed',
      },
    });

    const creatorProfile1 = await prisma.creatorProfile.create({
      data: {
        userId: creator1.id,
        username: 'hanan_lifestyle',
        displayName: 'Hanan Ahmed',
        avatar: '/api/placeholder/100/100',
        bio: 'Ethiopian lifestyle blogger sharing authentic moments and cultural stories',
        category: 'Lifestyle',
        location: 'Addis Ababa',
        followers: 45000,
        engagement: 8.5,
        rating: 4.9,
        completedCampaigns: 23,
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        isVerified: true,
        isAvailable: true,
      },
    });

    const creator2 = await prisma.user.create({
      data: {
        email: 'dawit@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'creator',
        name: 'Dawit Mengistu',
      },
    });

    const creatorProfile2 = await prisma.creatorProfile.create({
      data: {
        userId: creator2.id,
        username: 'dawit_tech',
        displayName: 'Dawit Mengistu',
        avatar: '/api/placeholder/100/100',
        bio: 'Tech reviewer and software developer specializing in emerging technologies',
        category: 'Technology',
        location: 'Addis Ababa',
        followers: 32000,
        engagement: 7.2,
        rating: 4.8,
        completedCampaigns: 18,
        platforms: ['YouTube', 'LinkedIn', 'Instagram'],
        isVerified: true,
        isAvailable: true,
      },
    });

    const creator3 = await prisma.user.create({
      data: {
        email: 'meron@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'creator',
        name: 'Meron Kassahun',
      },
    });

    const creatorProfile3 = await prisma.creatorProfile.create({
      data: {
        userId: creator3.id,
        username: 'meron_beauty',
        displayName: 'Meron Kassahun',
        avatar: '/api/placeholder/100/100',
        bio: 'Ethiopian beauty enthusiast and professional makeup artist',
        category: 'Beauty',
        location: 'Bahir Dar',
        followers: 28000,
        engagement: 9.1,
        rating: 4.7,
        completedCampaigns: 15,
        platforms: ['Instagram', 'TikTok'],
        isVerified: false,
        isAvailable: true,
      },
    });

    const creator4 = await prisma.user.create({
      data: {
        email: 'yohannes@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'creator',
        name: 'Yohannes Tadesse',
      },
    });

    const creatorProfile4 = await prisma.creatorProfile.create({
      data: {
        userId: creator4.id,
        username: 'yohannes_food',
        displayName: 'Yohannes Tadesse',
        avatar: '/api/placeholder/100/100',
        bio: 'Exploring Ethiopian cuisine and showcasing cultural heritage',
        category: 'Food & Travel',
        location: 'Dire Dawa',
        followers: 19000,
        engagement: 6.8,
        rating: 4.6,
        completedCampaigns: 12,
        platforms: ['Instagram', 'YouTube', 'Facebook'],
        isVerified: true,
        isAvailable: false,
      },
    });

    console.log('✅ Created 4 creator users');

    // Create campaigns
    const campaign1 = await prisma.campaign.create({
      data: {
        userId: brand1.id,
        title: 'Ethiopian Coffee Culture Campaign',
        description: 'Looking for lifestyle creators to showcase the authentic Ethiopian coffee experience. We want to highlight the traditional coffee ceremony and modern coffee culture in Ethiopia.',
      },
    });

    const campaign2 = await prisma.campaign.create({
      data: {
        userId: brand2.id,
        title: 'Fashion Week Content Creation',
        description: 'Seeking fashion influencers to cover our upcoming fashion week event. Looking for creative storytelling and high-quality content.',
      },
    });

    const campaign3 = await prisma.campaign.create({
      data: {
        userId: brand3.id,
        title: 'Tech Product Review Campaign',
        description: 'Looking for tech reviewers to create content about our new gadgets. Must have technical knowledge and engaging presentation style.',
      },
    });

    const campaign4 = await prisma.campaign.create({
      data: {
        userId: brand1.id,
        title: 'Social Media Campaign for New Coffee Blend',
        description: 'Promoting our new organic Ethiopian coffee blend. Looking for food and lifestyle content creators.',
      },
    });

    const campaign5 = await prisma.campaign.create({
      data: {
        userId: brand2.id,
        title: 'Sustainable Fashion Launch',
        description: 'New Ethiopian fashion brand launching sustainable clothing line. Seeking fashion influencers to showcase our eco-friendly designs.',
      },
    });

    console.log('✅ Created 5 campaigns');

    // Create some applications
    await prisma.campaignApplication.create({
      data: {
        campaignId: campaign1.id,
        creatorId: creator1.id,
        coverLetter: 'I would love to showcase Ethiopian coffee culture on my platform!',
        status: 'pending',
      },
    });

    await prisma.campaignApplication.create({
      data: {
        campaignId: campaign2.id,
        creatorId: creator3.id,
        coverLetter: 'Fashion is my passion, and I would be honored to cover your event.',
        status: 'approved',
      },
    });

    await prisma.campaignApplication.create({
      data: {
        campaignId: campaign3.id,
        creatorId: creator2.id,
        coverLetter: 'As a tech reviewer, I can provide in-depth analysis of your products.',
        status: 'pending',
      },
    });

    console.log('✅ Created 3 applications');

    // Create some connections
    await prisma.connection.create({
      data: {
        requesterId: brand1.id,
        receiverId: creator1.id,
        status: 'accepted',
      },
    });

    await prisma.connection.create({
      data: {
        requesterId: brand2.id,
        receiverId: creator3.id,
        status: 'accepted',
      },
    });

    await prisma.connection.create({
      data: {
        requesterId: brand3.id,
        receiverId: creator2.id,
        status: 'pending',
      },
    });

    console.log('✅ Created 3 connections');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 3 Brand users');
    console.log('  - 4 Creator users');
    console.log('  - 5 Campaigns');
    console.log('  - 3 Applications');
    console.log('  - 3 Connections');
    console.log('\n🔑 Login credentials (all users):');
    console.log('  Password: password123');
    console.log('\n  Brands:');
    console.log('    - ethiocoffee@example.com');
    console.log('    - addisfashion@example.com');
    console.log('    - techhub@example.com');
    console.log('\n  Creators:');
    console.log('    - hanan@example.com');
    console.log('    - dawit@example.com');
    console.log('    - meron@example.com');
    console.log('    - yohannes@example.com');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
