import mongoose, { Document, Schema } from "mongoose";

export interface IPage extends Document {
  campaignId: mongoose.Schema.Types.ObjectId;
  name: string;
  structureJson: any;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    structureJson: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "pages",
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        const { __v, _id, ...object } = ret;
        return { id: _id, ...object };
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

const Page = mongoose.model<IPage>("Page", pageSchema);

export default Page;
