import mongoose, { Document, Schema } from "mongoose";

export interface ICampaign extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "campaigns",
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

const Campaign = mongoose.model<ICampaign>("Campaign", campaignSchema);

export default Campaign;
