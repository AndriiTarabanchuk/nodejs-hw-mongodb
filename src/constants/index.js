export const ENV_VARS = {
  PORT: 'PORT',
};

export const MONGODB_VARS = {
  MONGODB_USER: 'MONGODB_USER',
  MONGODB_PASSWORD: 'MONGODB_PASSWORD',
  MONGODB_URL: 'MONGODB_URL',
  MONGODB_DB: 'MONGODB_DB',
};
export const SORT_ORDERS = { ASC: 'asc', DESC: 'desc' };

export const CONTACT_TYPE = {
  PERSONAL: 'personal',
  HOME: 'home',
  WORK: 'work',
};

export const ACCESS_TOKEN_LIVE_TIME = 1000 * 60 * 15; //15 minutes
export const REFRESH_TOKEN_LIVE_TIME = 1000 * 60 * 60 * 24 * 30; //30 days

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
  JWT_SECRET: 'JWT_SECRET',
  BACKEND_DOMAIN: 'BACKEND_DOMAIN',
  FRONTEND_DOMAIN: 'FRONTEND_DOMAIN',
  APP_DOMAIN: 'APP_DOMAIN ',
};

import path from 'node:path';
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
  ENABLE_CLOUDINARY: 'ENABLE_CLOUDINARY',
};

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
