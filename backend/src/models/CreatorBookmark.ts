import mongoose, { Document, Schema } from "mongoose";

export interface ICreatorBookmark extends Document {
  creatorId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const creatorBookmarkSchema = new Schema<ICreatorBookmark>(
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
    collection: "creator_bookmarks",
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

creatorBookmarkSchema.index({ creatorId: 1, userId: 1 }, { unique: true });

const CreatorBookmark = mongoose.model<ICreatorBookmark>(
  "CreatorBookmark",
  creatorBookmarkSchema,
);

export default CreatorBookmark;
