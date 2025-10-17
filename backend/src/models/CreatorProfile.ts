import mongoose, { Document, Schema } from "mongoose";

export interface ICreatorProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  category: string;
  location?: string;
  isVerified: boolean;
  isAvailable: boolean;
  rating: number;
  followers: number;
  engagement: number;
  completedCampaigns: number;
  platforms: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const creatorProfileSchema = new Schema<ICreatorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: "influencer",
    },
    location: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    engagement: {
      type: Number,
      default: 0,
    },
    completedCampaigns: {
      type: Number,
      default: 0,
    },
    platforms: {
      type: [String],
      default: [],
    },
    priceRange: {
      min: { type: Number },
      max: { type: Number },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "creator_profiles",
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        const { __v, _id, ...object } = ret;
        return { id: doc._id, ...object };
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

const CreatorProfile = mongoose.model<ICreatorProfile>(
  "CreatorProfile",
  creatorProfileSchema,
);

export default CreatorProfile;
