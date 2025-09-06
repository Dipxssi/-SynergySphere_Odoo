import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  members: {
    user: mongoose.Types.ObjectId;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
  }[];
  status: 'active' | 'completed' | 'on_hold' | 'archived';
  priority: 'low' | 'medium' | 'high';
  startDate: Date;
  endDate?: Date;
  color: string; // For UI visualization
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'on_hold', 'archived'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  color: {
    type: String,
    default: '#3498db' // Default blue color
  },
  taskStats: {
    total: { type: Number, default: 0 },
    todo: { type: Number, default: 0 },
    inProgress: { type: Number, default: 0 },
    review: { type: Number, default: 0 },
    done: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema);
