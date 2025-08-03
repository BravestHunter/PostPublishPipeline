import { PostDoc, PostModel } from '../models/post.js';

export const createPost = (data: Partial<PostDoc>) => new PostModel(data).save();

export const getPostById = (id: string) => PostModel.findById(id).exec();

export const updatePostStatus = (id: string, status: PostDoc['status'], reason?: string) =>
  PostModel.findByIdAndUpdate(id, { status, reason }, { new: true }).exec();
