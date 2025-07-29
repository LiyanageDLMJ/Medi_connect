import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  userType: string;
  title: string;
  message: string;
  type: 'application_status' | 'new_degree' | 'deadline_reminder' | 'system_announcement';
  read: boolean;
  relatedData?: {
    degreeId?: string;
    applicationId?: string;
    institutionId?: string;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['Medical Student', 'Professional Doctor', 'Educational Institute', 'Recruiter', 'Admin']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['application_status', 'new_degree', 'deadline_reminder', 'system_announcement']
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedData: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Use the EducationalInstitution database
const getNotificationModel = () => {
  return mongoose.connection.useDb('EducationalInstitution').model<INotification>('Notification', NotificationSchema);
};

export { getNotificationModel };
export default getNotificationModel; 