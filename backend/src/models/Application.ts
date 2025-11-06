import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  campaignId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  coverLetter?: string;
  proposedPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    coverLetter: { type: String },
    proposedPrice: { type: Number }
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

applicationSchema.index({ campaignId: 1, creatorId: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
