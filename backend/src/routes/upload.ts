import express, { Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure upload directories exist
const uploadDirs = ['uploads/avatars', 'uploads/portfolios', 'uploads/campaigns'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper function to save base64 image
const saveBase64Image = (base64Data: string, directory: string, filename: string): string => {
  // Remove data:image/xxx;base64, prefix
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const imageBuffer = Buffer.from(matches[2], 'base64');
  const filepath = path.join(directory, filename);
  
  fs.writeFileSync(filepath, imageBuffer);
  
  return `/${filepath}`;
};

// Upload avatar
router.post('/avatar', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { image } = req.body;
    
    if (!image) {
      res.status(400).json({ success: false, message: 'No image provided' });
      return;
    }

    const filename = `avatar-${req.userId}-${Date.now()}.png`;
    const url = saveBase64Image(image, 'uploads/avatars', filename);
    
    res.json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload portfolio item
router.post('/portfolio', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { image } = req.body;
    
    if (!image) {
      res.status(400).json({ success: false, message: 'No image provided' });
      return;
    }

    const filename = `portfolio-${req.userId}-${Date.now()}.png`;
    const url = saveBase64Image(image, 'uploads/portfolios', filename);
    
    res.json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload campaign image
router.post('/campaign', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { image } = req.body;
    
    if (!image) {
      res.status(400).json({ success: false, message: 'No image provided' });
      return;
    }

    const filename = `campaign-${req.userId}-${Date.now()}.png`;
    const url = saveBase64Image(image, 'uploads/campaigns', filename);
    
    res.json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
