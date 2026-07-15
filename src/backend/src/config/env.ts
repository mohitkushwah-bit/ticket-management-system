import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || (
  process.env.NODE_ENV === 'production'
    ? (() => { throw new Error('JWT_SECRET must be set in production'); })()
    : 'dev-secret-change-in-production'
);

export const env = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10): undefined ,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
