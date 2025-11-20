import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import StoryCard from '../components/StoryCard'
import { api } from '../services/api'

const Search = () => {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [status, setStatus] = useState('')
  const [author, setAuthor] = useState('')
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)

  const availableGenres = ['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Horror', 'Adventure', 'Drama', 'Comedy']
  const availableStatuses = ['ongoing', 'completed', 'hiatus']

  useEffect(() => {
    // Load popular stories on initial load
    const loadPopularStories = async () => {
      setLoading(true)
      try {
        const data = await api.getPopularStories({ page: 1, limit: 10 })
        setStories(data.stories || [])
        setTotalPages(data.pages || 1)
        setCurrentPage(1)
        setError('')
      } catch (err) {
        setError('Failed to load popular stories')
        console.error('Error loading popular stories:', err)
      } finally {
        setLoading(false)
      }
    }

    if (!hasSearched) {
      loadPopularStories()
    }
  }, [hasSearched])

  const handleSearch = async (page = 1) => {
    if (!query.trim() && !genre && !status && !author.trim()) {
      setError('Please enter a search query or select filters')
      return
    }

    setLoading(true)
    setError('')
    try {
      const params = {
        q: query.trim(),
        genre: genre || undefined,
        status: status || undefined,
        author: author.trim() || undefined,
        page,
        limit: 10
      }

      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

      const data = await api.searchStories(params)
      setStories(data.stories || [])
      setTotalPages(data.pages || 1)
      setCurrentPage(page)
      setHasSearched(true)
    } catch (err) {
      setError('Failed to search stories. Please try again.')
      console.error('Error searching stories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setQuery('')
    setGenre('')
    setStatus('')
    setAuthor('')
    setHasSearched(false)
    setCurrentPage(1)
    setError('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-base-200 pt-4 sm:pt-6 md:pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-base-content mb-2 sm:mb-3 md:mb-4 px-2 leading-tight">
            🔍 Search Stories
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-base-content/70 max-w-2xl mx-auto px-4">
            Find your next favorite story from our collection
          </p>
        </motion.div>

        {/* Search Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-base-100/90 backdrop-blur-md rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl border border-base-300 p-3 sm:p-4 md:p-5 lg:p-6 mb-4 sm:mb-6"
        >
          {/* Filters Grid - Stacks vertically on mobile, expands horizontally on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-4 sm:mb-5">
            {/* Search Query */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                <span className="mr-1.5">🔎</span>
                Search Query
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Title, description, or tags..."
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all duration-300 placeholder-gray-400 touch-manipulation"
                aria-label="Search query input"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label className="flex items-center text-xs sm:text-sm font-semibold text-base-content mb-1.5 sm:mb-2">
                <span className="mr-1.5">📚</span>
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all duration-300 bg-white cursor-pointer touch-manipulation appearance-none bg-no-repeat bg-right pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
                aria-label="Genre filter"
              >
                <option value="">All Genres</option>
                {availableGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="flex items-center text-xs sm:text-sm font-semibold text-base-content mb-1.5 sm:mb-2">
                <span className="mr-1.5">📊</span>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all duration-300 bg-white cursor-pointer touch-manipulation appearance-none bg-no-repeat bg-right pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
                aria-label="Status filter"
              >
                <option value="">All Statuses</option>
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="flex items-center text-xs sm:text-sm font-semibold text-base-content mb-1.5 sm:mb-2">
                <span className="mr-1.5">✍️</span>
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all duration-300 placeholder-gray-400 touch-manipulation"
                aria-label="Author filter input"
              />
            </div>
          </div>

          {/* Action Buttons - Stack on mobile, side-by-side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-content px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center shadow-lg disabled:shadow-none disabled:cursor-not-allowed touch-manipulation min-h-10"
              aria-label="Search stories"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-primary-content border-t-transparent mr-2"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">🔍</span>
                  <span>Search Stories</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearFilters}
              className="bg-base-200 hover:bg-base-300 text-base-content px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 border-2 border-base-300 hover:border-base-content/20 touch-manipulation min-h-10 flex items-center justify-center"
              aria-label="Clear all filters"
            >
              <span className="mr-2">🔄</span>
              <span>Clear Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error/20 border-2 border-error text-error-content px-4 sm:px-5 py-3 sm:py-4 rounded-xl mb-6 sm:mb-8 flex items-start space-x-2 shadow-sm"
            role="alert"
          >
            <span className="text-lg sm:text-xl shrink-0">⚠️</span>
            <p className="text-sm sm:text-base flex-1">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12 sm:py-16 md:py-20"
          >
            <div className="text-center">
              <div className="relative mx-auto w-12 h-12 sm:w-16 sm:h-16">
                <div className="animate-spin rounded-full h-full w-full border-4 sm:border-[5px] border-base-300 border-t-primary"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl">✨</span>
                </div>
              </div>
              <p className="mt-4 sm:mt-6 text-base-content/70 text-sm sm:text-base font-medium">Searching stories...</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {!loading && stories.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-base-content mb-2 flex items-center">
                <span className="mr-2 text-xl sm:text-2xl">
                  {hasSearched ? '🎯' : '🔥'}
                </span>
                <span>{hasSearched ? 'Search Results' : 'Popular Stories'}</span>
              </h2>
              <p className="text-sm sm:text-base text-base-content/70">
                {hasSearched ? `Found ${stories.length} ${stories.length === 1 ? 'story' : 'stories'}` : 'Discover trending stories'}
              </p>
            </motion.div>

            {/* Story Cards Grid - Optimized for all screen sizes */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-6 sm:mb-8 md:mb-10"
            >
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </motion.div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pb-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base text-gray-700 disabled:text-gray-400 shadow-md hover:shadow-lg disabled:shadow-none min-h-10 flex items-center justify-center touch-manipulation"
                  aria-label="Previous page"
                >
                  <span className="mr-2">←</span>
                  <span>Previous</span>
                </motion.button>
                
                <div className="flex items-center space-x-2 px-4 py-2.5 bg-primary/20 border-2 border-primary rounded-xl">
                  <span className="text-xs sm:text-sm font-semibold text-base-content">
                    Page <span className="text-primary text-base sm:text-lg font-bold mx-1">{currentPage}</span> of {totalPages}
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base text-gray-700 disabled:text-gray-400 shadow-md hover:shadow-lg disabled:shadow-none min-h-10 flex items-center justify-center touch-manipulation"
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <span className="ml-2">→</span>
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && stories.length === 0 && hasSearched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16 md:py-20 px-4"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">📚</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-base-content mb-2 sm:mb-3">No Stories Found</h3>
            <p className="text-sm sm:text-base md:text-lg text-base-content/70 max-w-md mx-auto mb-6 sm:mb-8">
              We couldn't find any stories matching your search. Try adjusting your filters or search terms.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="px-4 sm:px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-content rounded-xl font-bold shadow-lg transition-all duration-300 text-sm sm:text-base touch-manipulation"
            >
              Clear Filters & Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search