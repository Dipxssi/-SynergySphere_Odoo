import mongoose, { Schema, Types} from 'mongoose';
import bcrypt from 'bcryptjs';

// Don't extend Document - just define the interface
export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
    taskAssignments: boolean;
    projectUpdates: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define methods interface separately
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getFullName(): string;
}

// Combine for the model type
export type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  notificationPreferences: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    taskAssignments: { type: Boolean, default: true },
    projectUpdates: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Hash password before saving - Fixed version
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get full name
UserSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`;
};

export default mongoose.model<IUser, UserModel>('User', UserSchema);
