import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  role: 'creator' | 'brand' | 'admin';
  emailVerified: boolean;

  // Security & Verification
  isVerified: boolean;
  isVettedProfile: boolean;
  verificationDate?: Date;
  verifiedBy?: mongoose.Types.ObjectId;

  // Auth Providers
  googleId?: string;
  phoneNumber?: string;
  isPhoneVerified: boolean;

  // Payment Providers
  paymentProviders: {
    telebirr?: {
      phoneNumber: string;
      accountName?: string;
      isVerified: boolean;
      verifiedAt?: Date;
    };
    chapa?: {
      accountId: string;
      subaccountCode?: string;
      isVerified: boolean;
      verifiedAt?: Date;
    };
  };

  // Security Tracking
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  loginHistory: Array<{
    ip: string;
    userAgent: string;
    timestamp: Date;
    location?: string;
  }>;

  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
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
    },

    // Security & Verification
    isVerified: { type: Boolean, default: false },
    isVettedProfile: { type: Boolean, default: false },
    verificationDate: Date,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // Auth Providers
    googleId: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    isPhoneVerified: { type: Boolean, default: false },

    // Payment Providers
    paymentProviders: {
      telebirr: {
        phoneNumber: String,
        accountName: String,
        isVerified: { type: Boolean, default: false },
        verifiedAt: Date
      },
      chapa: {
        accountId: String,
        subaccountCode: String,
        isVerified: { type: Boolean, default: false },
        verifiedAt: Date
      }
    },

    // Security Tracking
    twoFactorEnabled: { type: Boolean, default: false },
    lastLogin: Date,
    loginHistory: [{
      ip: String,
      userAgent: String,
      timestamp: Date,
      location: String
    }],

    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, passwordHash, ...rest } = ret;
        return { id: _id, ...rest };
      }
    }
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
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
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);
