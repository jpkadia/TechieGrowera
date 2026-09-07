import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: z
    .string()
    .refine((value) => value === '' || /^mongodb(?:\+srv)?:\/\//.test(value), 'Invalid MongoDB URI')
    .default(''),
  FRONTEND_ORIGIN: z.url().default('http://localhost:3000'),
  API_PROXY_SECRET: z.string().default(''),
  RATE_LIMIT_SALT: z.string().default(''),
});
export const env = schema.parse(process.env);
if (
  env.NODE_ENV === 'production' &&
  (!env.MONGODB_URI ||
    env.API_PROXY_SECRET.length < 32 ||
    env.RATE_LIMIT_SALT.length < 32 ||
    !env.FRONTEND_ORIGIN.startsWith('https://'))
)
  throw new Error(
    'Production requires database access, independent 32-character secrets and an HTTPS frontend origin.',
  );
