import { SORT_ORDERS } from '../../constants/index.js';

export const parseSortParams = (query) => {
  const parseSortOrder = [SORT_ORDERS.ASC, SORT_ORDERS.DESC].includes(
    query.sortOrder,
  )
    ? query.sortOrder
    : SORT_ORDERS.ASC;

  const keysOfContact = [
    '_id',
    'name',
    'age',
    'gender',
    'avgMark',
    'onDuty',
    'createdAt',
    'updatedAt',
  ];

  const parseSortBy = keysOfContact.includes(query.sortBy)
    ? query.sortBy
    : 'name';

  return {
    sortOrder: parseSortOrder,
    sortBy: parseSortBy,
  };
};
