import mongoose from 'mongoose';

export const connectToDatabase = async (
  uri = process.env.MONGODB_URI ?? '',
  dbName = process.env.MONGODB_DB ?? 'maindb',
  user = process.env.MONGODB_USER ?? '',
  pass = process.env.MONGODB_PASSWORD ?? '',
): Promise<typeof mongoose> => {
  if (!uri) throw new Error('MONGODB_URI missing');
  return mongoose.connect(uri, { dbName, user, pass });
};
