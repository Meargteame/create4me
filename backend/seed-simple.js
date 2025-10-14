const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.campaignApplication.deleteMany();
  await prisma.creatorBookmark.deleteMany();
  await prisma.creatorLike.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.task.deleteMany();
  await prisma.page.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared data');

  // Create brands
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

  console.log('✅ Created 3 brands');

  // Create creators
  const creator1 = await prisma.user.create({
    data: {
      email: 'hanan@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'creator',
      name: 'Hanan Ahmed',
    },
  });

  await prisma.creatorProfile.create({
    data: {
      userId: creator1.id,
      username: 'hanan_lifestyle',
      displayName: 'Hanan Ahmed',
      bio: 'Ethiopian lifestyle blogger',
      category: 'Lifestyle',
      location: 'Addis Ababa',
      followers: 45000,
      engagement: 8.5,
      rating: 4.9,
      completedCampaigns: 23,
      platforms: ['Instagram', 'TikTok', 'YouTube'],
      isVerified: true,
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

  await prisma.creatorProfile.create({
    data: {
      userId: creator2.id,
      username: 'dawit_tech',
      displayName: 'Dawit Mengistu',
      bio: 'Tech reviewer and developer',
      category: 'Technology',
      location: 'Addis Ababa',
      followers: 32000,
      engagement: 7.2,
      rating: 4.8,
      completedCampaigns: 18,
      platforms: ['YouTube', 'LinkedIn'],
      isVerified: true,
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

  await prisma.creatorProfile.create({
    data: {
      userId: creator3.id,
      username: 'meron_beauty',
      displayName: 'Meron Kassahun',
      bio: 'Beauty enthusiast and makeup artist',
      category: 'Beauty',
      location: 'Bahir Dar',
      followers: 28000,
      engagement: 9.1,
      rating: 4.7,
      completedCampaigns: 15,
      platforms: ['Instagram', 'TikTok'],
    },
  });

  console.log('✅ Created 3 creators');

  // Create campaigns
  await prisma.campaign.create({
    data: {
      userId: brand1.id,
      title: 'Ethiopian Coffee Culture Campaign',
      description: 'Showcase authentic Ethiopian coffee experience',
    },
  });

  await prisma.campaign.create({
    data: {
      userId: brand2.id,
      title: 'Fashion Week Content Creation',
      description: 'Cover our upcoming fashion week event',
    },
  });

  await prisma.campaign.create({
    data: {
      userId: brand3.id,
      title: 'Tech Product Review Campaign',
      description: 'Review our new gadgets and tech products',
    },
  });

  await prisma.campaign.create({
    data: {
      userId: brand1.id,
      title: 'New Coffee Blend Launch',
      description: 'Promote our organic Ethiopian coffee blend',
    },
  });

  await prisma.campaign.create({
    data: {
      userId: brand2.id,
      title: 'Sustainable Fashion Launch',
      description: 'Showcase eco-friendly Ethiopian designs',
    },
  });

  console.log('✅ Created 5 campaigns');

  console.log('\n🎉 Database seeded!');
  console.log('\n🔑 Login credentials:');
  console.log('  Password: password123');
  console.log('\n  Brands:');
  console.log('    - ethiocoffee@example.com');
  console.log('    - addisfashion@example.com');
  console.log('    - techhub@example.com');
  console.log('\n  Creators:');
  console.log('    - hanan@example.com');
  console.log('    - dawit@example.com');
  console.log('    - meron@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
