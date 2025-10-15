import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  role: 'creator' | 'brand' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['creator', 'brand', 'admin'],
    default: 'creator'
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove password hash from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

export default mongoose.model<IUser>('User', userSchema);
