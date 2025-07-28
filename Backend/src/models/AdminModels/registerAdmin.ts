import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  country: 'Sri Lanka' | 'India' | 'Malaysia' | 'Singapore' | 'Other';
  mobileNumber: string;
  streetAddress: string;
  createdAt: Date;
  lastLogin?: Date;
  comparePassword?(candidatePassword: string): Promise<boolean>;
}

interface IAdminModel extends Model<IAdmin> {
}

const AdminSchema: Schema<IAdmin> = new Schema({
});

AdminSchema.pre<IAdmin>('save', async function(next) {
});

AdminSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const db = mongoose.connection.useDb("MediConnect");
const Admin: IAdminModel = db.model<IAdmin, IAdminModel>('Admin', AdminSchema, 'admins');

export default Admin;