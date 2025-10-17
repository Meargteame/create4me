import mongoose, { Document, Schema } from "mongoose";

export interface ICreatorLike extends Document {
  creatorId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const creatorLikeSchema = new Schema<ICreatorLike>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "CreatorProfile",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "creator_likes",
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

creatorLikeSchema.index({ creatorId: 1, userId: 1 }, { unique: true });

const CreatorLike = mongoose.model<ICreatorLike>(
  "CreatorLike",
  creatorLikeSchema,
);

export default CreatorLike;
