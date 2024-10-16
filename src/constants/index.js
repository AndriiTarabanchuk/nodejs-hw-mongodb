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
