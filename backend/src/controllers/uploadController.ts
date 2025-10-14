import { Request, Response } from 'express';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
  
  // Create subdirectories
  const subdirs = ['avatars', 'portfolios', 'campaigns'];
  for (const subdir of subdirs) {
    const dirPath = path.join(UPLOAD_DIR, subdir);
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
  }
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const hash = crypto.randomBytes(16).toString('hex');
  return `${Date.now()}-${hash}${ext}`;
}

// Parse base64 image
function parseBase64Image(dataUrl: string): { buffer: Buffer; mimeType: string } | null {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  
  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], 'base64')
  };
}

// Upload avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { image, filename } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Parse base64 image
    const imageData = parseBase64Image(image);
    if (!imageData) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(imageData.mimeType)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP' 
      });
    }

    // Validate file size
    if (imageData.buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      });
    }

    // Ensure upload directory exists
    await ensureUploadDir();

    // Generate filename and save
    const newFilename = generateFilename(filename || 'avatar.jpg');
    const filePath = path.join(UPLOAD_DIR, 'avatars', newFilename);
    await writeFile(filePath, imageData.buffer);

    // Return URL
    const imageUrl = `/uploads/avatars/${newFilename}`;

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      url: imageUrl,
      filename: newFilename
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};

// Upload portfolio image
export const uploadPortfolioImage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { image, filename } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Parse base64 image
    const imageData = parseBase64Image(image);
    if (!imageData) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(imageData.mimeType)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP' 
      });
    }

    // Validate file size
    if (imageData.buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      });
    }

    // Ensure upload directory exists
    await ensureUploadDir();

    // Generate filename and save
    const newFilename = generateFilename(filename || 'portfolio.jpg');
    const filePath = path.join(UPLOAD_DIR, 'portfolios', newFilename);
    await writeFile(filePath, imageData.buffer);

    // Return URL
    const imageUrl = `/uploads/portfolios/${newFilename}`;

    res.json({
      success: true,
      message: 'Portfolio image uploaded successfully',
      url: imageUrl,
      filename: newFilename
    });
  } catch (error) {
    console.error('Upload portfolio image error:', error);
    res.status(500).json({ message: 'Failed to upload portfolio image' });
  }
};

// Upload campaign image
export const uploadCampaignImage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { image, filename } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Parse base64 image
    const imageData = parseBase64Image(image);
    if (!imageData) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(imageData.mimeType)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP' 
      });
    }

    // Validate file size
    if (imageData.buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      });
    }

    // Ensure upload directory exists
    await ensureUploadDir();

    // Generate filename and save
    const newFilename = generateFilename(filename || 'campaign.jpg');
    const filePath = path.join(UPLOAD_DIR, 'campaigns', newFilename);
    await writeFile(filePath, imageData.buffer);

    // Return URL
    const imageUrl = `/uploads/campaigns/${newFilename}`;

    res.json({
      success: true,
      message: 'Campaign image uploaded successfully',
      url: imageUrl,
      filename: newFilename
    });
  } catch (error) {
    console.error('Upload campaign image error:', error);
    res.status(500).json({ message: 'Failed to upload campaign image' });
  }
};
