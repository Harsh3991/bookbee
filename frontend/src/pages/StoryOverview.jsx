import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const StoryOverview = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Like/Bookmark states
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/story/${storyId}`);
    }
  }, [isAuthenticated, navigate, storyId]);

  useEffect(() => {
    if (storyId && isAuthenticated) {
      loadStoryData();
    }
  }, [storyId, isAuthenticated]);

  const loadStoryData = async () => {
    try {
      setLoading(true);
      setError('');

      const [storyData, chaptersData] = await Promise.all([
        api.getStoryById(storyId),
        api.getChapters(storyId)
      ]);

      setStory(storyData);
      setChapters(chaptersData.filter(ch => ch.published));
      
      // Initialize like/bookmark states from story data
      setLikeCount(storyData.likes || 0);
      setIsLiked(storyData.isLiked || false);
      setIsBookmarked(storyData.isBookmarked || false);
    } catch (err) {
      setError(err.message || 'Failed to load story data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/story/${storyId}`);
      return;
    }

    if (likingInProgress) return;

    try {
      setLikingInProgress(true);
      await api.likeStory(storyId);
      
      // Toggle like state
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      showMessage('success', isLiked ? 'Removed from favorites' : 'Added to favorites!');
    } catch (err) {
      showMessage('error', err.message || 'Failed to update like status');
    } finally {
      setLikingInProgress(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/story/${storyId}`);
      return;
    }

    if (bookmarkingInProgress) return;

    try {
      setBookmarkingInProgress(true);
      
      if (isBookmarked) {
        await api.removeBookmark(storyId);
      } else {
        await api.addBookmark(storyId);
      }
      
      setIsBookmarked(!isBookmarked);
      showMessage('success', isBookmarked ? 'Removed from library' : 'Added to library!');
    } catch (err) {
      showMessage('error', err.message || 'Failed to update bookmark status');
    } finally {
      setBookmarkingInProgress(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showMessage('success', 'Link copied to clipboard!');
    }).catch(() => {
      showMessage('error', 'Failed to copy link');
    });
  };

  const handleStartReading = () => {
    if (chapters.length > 0) {
      navigate(`/read/${storyId}/${chapters[0]._id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
            <div className="animate-spin rounded-full h-full w-full border-4 sm:border-[5px] border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">📖</span>
            </div>
          </div>
          <p className="mt-6 text-base-content/70 text-base sm:text-lg font-serif">Loading story...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-error mb-4 text-base sm:text-lg">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 text-primary-content px-6 py-2 rounded-lg font-semibold text-sm sm:text-base touch-manipulation"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Toast Notification */}
      <AnimatePresence>
        {actionMessage.text && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className={`alert ${actionMessage.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                {actionMessage.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span>{actionMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
            {/* Cover Image */}
            <div className="shrink-0 mx-auto lg:mx-0">
              <img
                src={story.coverImage || 'https://picsum.photos/300/400?random=1'}
                alt={`${story.title} cover`}
                className="w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-64 lg:w-52 lg:h-72 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Story Details */}
            <div className="flex-1 min-w-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-base-content mb-2 wrap-break-word">{story.title}</h1>
                <p className="text-sm sm:text-base text-base-content/70 mb-2">by {story.author?.name || 'Unknown Author'}</p>
                <p className="text-xs sm:text-sm text-base-content/60 flex flex-wrap gap-x-2 gap-y-1">
                  <span>Created: {new Date(story.createdAt).toLocaleDateString()}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>Status: <span className="capitalize font-medium">{story.status}</span></span>
                </p>
              </div>

              <p className="text-sm sm:text-base text-base-content/80 mb-4 mt-3 leading-relaxed wrap-break-word">{story.description}</p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mb-4">
                <div className="wrap-break-word">
                  <span className="font-medium">Genres:</span>{' '}
                  {story.genres?.length > 0 ? story.genres.join(', ') : 'None'}
                </div>
                <div className="wrap-break-word">
                  <span className="font-medium">Tags:</span>{' '}
                  {story.tags?.length > 0 ? story.tags.join(', ') : 'None'}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-base-content/70 mb-6">
                <span>Views: {story.views || 0}</span>
                <span>Likes: {likeCount}</span>
                <span>Rating: {story.rating || 0} ★</span>
                <span>Reviews: {story.reviewCount || 0}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  disabled={likingInProgress}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all touch-manipulation ${
                    isLiked
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 text-base-content hover:bg-base-300'
                  }`}
                >
                  {likingInProgress ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  disabled={bookmarkingInProgress}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all touch-manipulation ${
                    isBookmarked
                      ? 'bg-secondary text-secondary-content'
                      : 'bg-base-200 text-base-content hover:bg-base-300'
                  }`}
                >
                  {bookmarkingInProgress ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm sm:text-base bg-base-200 text-base-content hover:bg-base-300 transition-all touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="hidden sm:inline">Share</span>
                </motion.button>

                {chapters.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartReading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm sm:text-base bg-accent text-accent-content hover:brightness-110 transition-all shadow-lg touch-manipulation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Start Reading</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-100 rounded-xl shadow-lg p-4 sm:p-5 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
              Chapters ({chapters.length})
            </h2>
          </div>

          {chapters.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {chapters.map((chapter) => (
                <motion.div
                  key={chapter._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
                  onClick={() => navigate(`/read/${storyId}/${chapter._id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-base sm:text-lg font-semibold text-base-content shrink-0">
                        Chapter {chapter.chapterNumber}
                      </span>
                      <span className="text-sm sm:text-base text-base-content/70 truncate">{chapter.title}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-base-content/50 mt-1 sm:mt-2 flex flex-wrap gap-x-2 gap-y-1">
                      <span>Created: {new Date(chapter.createdAt).toLocaleDateString()}</span>
                      <span className="hidden sm:inline">|</span>
                      <span>Views: {chapter.views || 0}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/read/${storyId}/${chapter._id}`);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 text-xs sm:text-sm font-semibold min-h-9 sm:min-h-10 touch-manipulation transition-colors"
                  >
                    Read Chapter
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-base-content/40 mb-4">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-base-content mb-2">No chapters available</h3>
              <p className="text-sm sm:text-base text-base-content/60">This story doesn't have any published chapters yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StoryOverview;
