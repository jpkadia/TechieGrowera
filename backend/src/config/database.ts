import mongoose from 'mongoose';
import { env } from './env.js';
let connection: Promise<typeof mongoose> | null = null;
export async function connectDatabase() {
  if (!env.MONGODB_URI)
    throw Object.assign(
      new Error('Enquiries are temporarily unavailable. Please try again later.'),
      { status: 503 },
    );
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connection)
    connection = mongoose
      .connect(env.MONGODB_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        autoIndex: env.NODE_ENV !== 'production',
      })
      .catch((error) => {
        connection = null;
        throw error;
      });
  return connection;
}
