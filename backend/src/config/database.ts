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
        serverSelectionTimeoutMS: 20000,
        connectTimeoutMS: 20000,
        autoIndex: env.NODE_ENV !== 'production',
      })
      .catch((error) => {
        connection = null;
        throw error;
      });
  return connection;
}

export function warmDatabase(): void {
  if (mongoose.connection.readyState === 1 || connection) return;
  connectDatabase().catch((err) => {
    console.warn('[DB] Pre-warm connection attempt deferred:', (err as Error).message);
  });
}
