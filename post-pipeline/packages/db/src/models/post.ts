import mongoose, { Document, Schema } from 'mongoose';

export interface MediaFile {
  filename: string;
  mimetype: string;
  size: number;
  path?: string;
}

export interface PostDoc extends Document {
  text: string;
  socialPlatform: string;
  mediaFiles?: MediaFile[];
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaFileSchema = new Schema<MediaFile>(
  {
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String },
  },
  { _id: false },
);

const postSchema = new Schema<PostDoc>(
  {
    text: { type: String, required: true },
    socialPlatform: { type: String, required: true },
    mediaFiles: [mediaFileSchema],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reason: { type: String },
  },
  { timestamps: true },
);

export const PostModel = mongoose.model<PostDoc>('Post', postSchema);
