import mongoose, { Document, Schema } from 'mongoose';

export interface IPayout extends Document {
  creatorId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  amount: number;
  platformFee: number;
  netPayout: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider: 'telebirr' | 'chapa';
  transactionId?: string;
  processedAt?: Date;
  failureReason?: string;
}

const PayoutSchema = new Schema<IPayout>(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    brandId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    netPayout: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    provider: { type: String, enum: ['telebirr', 'chapa'], required: true },
    transactionId: { type: String },
    processedAt: { type: Date },
    failureReason: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, ...rest } = ret;
        return { id: _id, ...rest };
      },
    },
  }
);

export const Payout = mongoose.model<IPayout>('Payout', PayoutSchema);
