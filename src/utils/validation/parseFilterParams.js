import { parseNumber } from './parseNumber.js';

const BOOLEANS = ['true', 'false'];
const parseBoolean = (value) => {
  // if (!BOOLEANS.includes(value)) return;
  // return value === 'true' ? true : false;
  if (BOOLEANS.includes(value)) return value;
};

const CONTACT_TYPE = ['personal', 'home', 'work'];
const parseContactType = (value) => {
  if (CONTACT_TYPE.includes(value)) return value;
};

export const parseFilterParams = (query) => {
  return {
    isFavourite: parseBoolean(query.isFavourite),
    contactType: parseContactType(query.contactType),
  };
};
