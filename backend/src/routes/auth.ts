import express, { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authenticate, AuthRequest } from '../middleware/auth';
import { OtpService } from '../services/otp';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      return;
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now
      user_metadata: { name, role: role || 'creator' }
    });

    if (authError) {
      res.status(400).json({ success: false, message: authError.message });
      return;
    }

    if (!authData.user) {
      res.status(500).json({ success: false, message: 'Failed to create user' });
      return;
    }

    const userId = authData.user.id;

    // 2. Insert into public 'users' table
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        name,
        role: role || 'creator'
      });

    if (dbError) {
      // Cleanup auth user if db insert fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      res.status(500).json({ success: false, message: 'Database error: ' + dbError.message });
      return;
    }

    // 3. Create CreatorProfile if needed
    if (role === 'creator') {
      await supabaseAdmin
        .from('creator_profiles')
        .insert({
          user_id: userId,
          display_name: name || 'Creator',
          username: email.split('@')[0].toLowerCase() + Math.floor(Math.random() * 1000),
          bio: `Hi, I'm ${name || 'a creator'}! I'm excited to collaborate with brands.`
        });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: userId, email, name, role }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Use Supabase Auth to sign in
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      res.status(401).json({ success: false, message: error.message });
      return;
    }

    if (!data.user || !data.session) {
      res.status(500).json({ success: false, message: 'Login failed' });
      return;
    }

    // Fetch user details from our 'users' table
    const { data: userDetails } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Return the Supabase Session Access Token
    res.json({
      success: true,
      message: 'Login successful',
      user: userDetails || { id: data.user.id, email: data.user.email },
      token: data.session.access_token // This is the JWT
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  // Auth middleware creates req.user from the token
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
