import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Connect to database
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to MongoDB database via Prisma');
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
