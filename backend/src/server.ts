import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Import database
import prisma from './database/prisma';

// Import routes
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns';
import pageRoutes from './routes/pages';
import { projectTaskRoutes, taskRouter } from './routes/tasks';
import aiRoutes from './routes/ai';
import applicationRoutes from './routes/applications';
import creatorRoutes from './routes/creators';
import connectionRoutes from './routes/connections';
import uploadRoutes from './routes/upload';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { authenticateToken } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || '*']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Favicon handler to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Root health check (for Railway and other platforms)
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Create4Me API Server',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check routes (both /health and /api/health for compatibility)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/projects/:projectId/tasks', projectTaskRoutes);
app.use('/api/tasks', taskRouter);
app.use('/api/pages', pageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/upload', uploadRoutes);

// Import page controller functions for project routes
import { createPage, getPages } from './controllers/pageController';

// Add project pages routes with /api prefix
app.post('/api/projects/:id/pages', authenticateToken, createPage);
app.get('/api/projects/:id/pages', authenticateToken, getPages);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: MongoDB with Prisma ORM`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
