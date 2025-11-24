import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  senderRole: 'creator' | 'brand';
  content: string; // Filtered/clean content
  originalContent?: string; // Original before filtering (for moderation)
  hasFilteredContent: boolean;
  filteredWords?: string[];
  riskLevel: 'low' | 'medium' | 'high';
  warningIssued: boolean;
  attachments?: string[];
  read: boolean;
  readAt?: Date;
  deletedBy?: mongoose.Types.ObjectId[]; // Soft delete per user
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderRole: { type: String, enum: ['creator', 'brand'], required: true },

    // Content fields
    content: { type: String, required: true },
    originalContent: { type: String }, // Saved only if filtered
    hasFilteredContent: { type: Boolean, default: false },
    filteredWords: [{ type: String }],
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    warningIssued: { type: Boolean, default: false },

    attachments: [{ type: String }],
    read: { type: Boolean, default: false },
    readAt: { type: Date },
    deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, originalContent, deletedBy, ...rest } = ret;
        return { id: _id, ...rest };
      }
    }
  }
);

// Indexes for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ hasFilteredContent: 1 }); // For moderation
messageSchema.index({ riskLevel: 1 }); // For flagging high-risk messages

export const Message = mongoose.model<IMessage>('Message', messageSchema);
