const paginate = (page, limit) => {
  const currentPage = parseInt(page) || 1;
  const currentLimit = parseInt(limit) || 10;
  const skip = (currentPage - 1) * currentLimit;

  return {
    skip,
    limit: currentLimit,
    page: currentPage,
  };
};

const getPaginationInfo = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    pages: totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = {
  paginate,
  getPaginationInfo,
};
