import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns';
import creatorRoutes from './routes/creators';
import applicationRoutes from './routes/applications';
import chatRoutes from './routes/chat';
// import paymentRoutes from './routes/payments'; // Need to migrate payments later
// import uploadRoutes from './routes/upload'; // Need to migrate upload later
import { supabaseAdmin } from './config/supabase';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/chat', chatRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', async (req, res) => {
  const { error } = await supabaseAdmin.from('users').select('count').limit(1);
  if (error) {
    return res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
  res.status(200).json({ status: 'ok', database: 'connected' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('✅ Supabase connected');
});

export default app;
