import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'task_assigned' | 'task_updated' | 'project_invite' | 'due_date_reminder' | 'project_update' | 'comment_added';
  title: string;
  message: string;
  data: {
    projectId?: mongoose.Types.ObjectId;
    taskId?: mongoose.Types.ObjectId;
    actionUrl?: string;
  };
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['task_assigned', 'task_updated', 'project_invite', 'due_date_reminder', 'project_update', 'comment_added'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task'
    },
    actionUrl: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
