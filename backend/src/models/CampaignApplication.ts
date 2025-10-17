import mongoose, { Document, Schema } from "mongoose";

export interface ICampaignApplication extends Document {
  campaignId: mongoose.Schema.Types.ObjectId;
  creatorId: mongoose.Schema.Types.ObjectId;
  coverLetter: string;
  portfolioLink?: string;
  deliverables?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const campaignApplicationSchema = new Schema<ICampaignApplication>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },
    portfolioLink: {
      type: String,
      trim: true,
    },
    deliverables: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: "campaign_applications",
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

const CampaignApplication = mongoose.model<ICampaignApplication>(
  "CampaignApplication",
  campaignApplicationSchema,
);

export default CampaignApplication;
