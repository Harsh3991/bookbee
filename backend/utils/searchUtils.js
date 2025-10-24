const buildSearchQuery = (queryParams) => {
  const { q, genre, status, author } = queryParams;
  let query = {};

  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } },
    ];
  }

  if (genre) {
    query.genres = { $in: [genre] };
  }

  if (status) {
    query.status = status;
  }

  if (author) {
    // Assuming author is name, find user ID
    // This would need User model, but for utility, return query
    query.author = author; // Placeholder, adjust as needed
  }

  return query;
};

const sortOptions = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  popular: { views: -1 },
  rating: { rating: -1 },
};

module.exports = {
  buildSearchQuery,
  sortOptions,
};
