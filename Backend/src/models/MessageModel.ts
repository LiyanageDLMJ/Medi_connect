import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export default mongoose.model<IMessage>('Message', messageSchema);
