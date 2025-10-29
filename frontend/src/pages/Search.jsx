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
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find your next favorite story from our collection
          </p>
        </motion.div>

        {/* Search Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Title, description, or tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">All Genres</option>
                {availableGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
            <button
              onClick={handleClearFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching stories...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && stories.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {hasSearched ? 'Search Results' : 'Popular Stories'}
              </h2>
              <p className="text-gray-600">
                {hasSearched ? `Found ${stories.length} stories` : 'Discover trending stories'}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"
            >
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handleSearch(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handleSearch(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && stories.length === 0 && hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">No stories found. Try adjusting your filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search