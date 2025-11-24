import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  userId: mongoose.Types.ObjectId; // Kept for backward compatibility
  brandId: mongoose.Types.ObjectId; // Added for payment logic
  title: string;
  description: string;
  budget: number;
  category?: string;
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  requirements?: string;
  deliverables?: string[];
  deadline?: Date;

  // Payment Fields
  paymentStatus: 'pending' | 'escrowed' | 'released' | 'refunded' | 'failed';
  paymentPerPost?: number;
  payoutDate?: Date;
  payoutTransactionId?: string;
  payoutAmount?: number;
  platformFee?: number;
  payoutProvider?: 'chapa' | 'telebirr';
  paymentError?: string;
  paymentErrorDate?: Date;

  // Enhanced fields
  coverImage?: string;
  targetAudience?: string;
  platforms?: string[];
  contentType?: string[];
  views: number;
  applicationsCount: number;
  selectedCreators?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    brandId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Usually same as userId
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    category: { type: String },
    status: { type: String, enum: ['draft', 'active', 'in_progress', 'completed', 'cancelled'], default: 'active' },
    requirements: { type: String },
    deliverables: [{ type: String }],
    deadline: { type: Date },

    // Payment Fields
    paymentStatus: {
      type: String,
      enum: ['pending', 'escrowed', 'released', 'refunded', 'failed'],
      default: 'pending'
    },
    paymentPerPost: { type: Number },
    payoutDate: { type: Date },
    payoutTransactionId: { type: String },
    payoutAmount: { type: Number },
    platformFee: { type: Number },
    payoutProvider: { type: String, enum: ['chapa', 'telebirr'] },
    paymentError: { type: String },
    paymentErrorDate: { type: Date },

    // Enhanced fields
    coverImage: { type: String },
    targetAudience: { type: String },
    platforms: [{ type: String }],
    contentType: [{ type: String }],
    views: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
    selectedCreators: [{ type: Schema.Types.ObjectId, ref: 'User' }]
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

// Pre-save hook to ensure brandId is set if missing (copy from userId)
campaignSchema.pre('validate', function (next) {
  if (this.userId && !this.brandId) {
    this.brandId = this.userId;
  }
  next();
});

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
