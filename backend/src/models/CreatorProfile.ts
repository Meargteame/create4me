import mongoose, { Document, Schema } from 'mongoose';

export interface ICreatorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  category: string;
  location?: string;
  platforms: string[];
  followers: number;
  engagement: number;
  rating: number;
  completedCampaigns: number;
  isAvailable: boolean;
  isVerified: boolean;
  tags: string[];
  // Enhanced fields
  portfolioItems: Array<{
    type: 'image' | 'video' | 'link';
    url: string;
    title: string;
    description?: string;
    thumbnail?: string;
  }>;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  skills: string[];
  languages: string[];
  hourlyRate?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: number; // in hours
  completionRate: number; // percentage
  profileViews: number;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const creatorProfileSchema = new Schema<ICreatorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    bio: { type: String },
    avatar: { type: String },
    category: { type: String, default: 'General' },
    location: { type: String },
    platforms: [{ type: String }],
    followers: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    completedCampaigns: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    tags: [{ type: String }],
    // Enhanced fields
    portfolioItems: [{
      type: { type: String, enum: ['image', 'video', 'link'] },
      url: { type: String },
      title: { type: String },
      description: { type: String },
      thumbnail: { type: String }
    }],
    socialLinks: {
      instagram: { type: String },
      tiktok: { type: String },
      youtube: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      facebook: { type: String }
    },
    skills: [{ type: String }],
    languages: [{ type: String }],
    hourlyRate: { type: Number },
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    },
    availability: { type: String, enum: ['available', 'busy', 'unavailable'], default: 'available' },
    responseTime: { type: Number, default: 24 },
    completionRate: { type: Number, default: 100 },
    profileViews: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, ...rest } = ret;
        return { id: _id, ...rest };
      }
    }
  }
);

export const CreatorProfile = mongoose.model<ICreatorProfile>('CreatorProfile', creatorProfileSchema);
