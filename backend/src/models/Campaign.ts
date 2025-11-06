import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget?: number;
  category?: string;
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  requirements?: string;
  deliverables?: string[];
  deadline?: Date;
  // Enhanced fields
  coverImage?: string;
  targetAudience?: string;
  platforms?: string[];
  contentType?: string[];
  views: number;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number },
    category: { type: String },
    status: { type: String, enum: ['draft', 'active', 'in_progress', 'completed', 'cancelled'], default: 'active' },
    requirements: { type: String },
    deliverables: [{ type: String }],
    deadline: { type: Date },
    // Enhanced fields
    coverImage: { type: String },
    targetAudience: { type: String },
    platforms: [{ type: String }],
    contentType: [{ type: String }],
    views: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 }
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

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
