import mongoose, { Document, Schema } from "mongoose";

export interface IConnection extends Document {
  requesterId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  lastActive: Date;
  mutualConnections: number;
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new Schema<IConnection>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    mutualConnections: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "connections",
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

connectionSchema.index({ requesterId: 1, receiverId: 1 }, { unique: true });

const Connection = mongoose.model<IConnection>("Connection", connectionSchema);

export default Connection;
