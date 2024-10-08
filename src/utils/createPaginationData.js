export const createPaginationData = (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage =
    page > 1 && (page < totalPages || page === totalPages);

  return {
    page: page,
    perPage: perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};
