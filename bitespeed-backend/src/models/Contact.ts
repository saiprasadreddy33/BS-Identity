import { Schema, model, Document } from 'mongoose';

interface IContact extends Document {
  phoneNumber?: string;
  email?: string;
  linkedId?: Schema.Types.ObjectId;
  linkPrecedence: 'primary' | 'secondary';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const contactSchema = new Schema<IContact>({
  phoneNumber: { type: String, required: false },
  email: { type: String, required: false },
  linkedId: { type: Schema.Types.ObjectId, required: false },
  linkPrecedence: { type: String, required: true, enum: ['primary', 'secondary'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, required: false }
});

const Contact = model<IContact>('Contact', contactSchema);

export default Contact;
