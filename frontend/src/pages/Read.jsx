import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Simple debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Read = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [readingProgress, setReadingProgress] = useState(null);
  
  const isProgrammaticScroll = useRef(false);  // New ref to track programmatic scrolls

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/read/${storyId}/${chapterId}`);
    }
  }, [isAuthenticated, navigate, storyId, chapterId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStoryAndChapters();
    }
  }, [storyId, isAuthenticated]);

  useEffect(() => {
    if (chapters.length > 0 && chapterId) {
      const chapter = chapters.find(ch => ch._id === chapterId);
      if (chapter) {
        setCurrentChapter(chapter);
        loadReadingProgress();
      }
    } else if (chapters.length > 0 && !chapterId) {
      // Start from first chapter
      setCurrentChapter(chapters[0]);
      navigate(`/read/${storyId}/${chapters[0]._id}`, { replace: true });
    }
  }, [chapters, chapterId]);

  useEffect(() => {
    // Scroll to saved position after chapter loads
    if (currentChapter && readingProgress && readingProgress.progress > 0) {
      isProgrammaticScroll.current = true;  // Mark as programmatic
      setTimeout(() => {
        const element = document.getElementById('chapter-content');
        if (element) {
          const scrollHeight = element.scrollHeight - element.clientHeight;
          const scrollPosition = (readingProgress.progress / 100) * scrollHeight;
          element.scrollTop = scrollPosition;
        }
        isProgrammaticScroll.current = false;  // Reset after setting
      }, 500); // Small delay to ensure content is rendered
    }
  }, [currentChapter, readingProgress]);

  const loadStoryAndChapters = async () => {
    try {
      setLoading(true);
      const [storyData, chaptersData] = await Promise.all([
        api.getStoryById(storyId),
        api.getChapters(storyId)
      ]);

      setStory(storyData);
      setChapters(chaptersData.filter(ch => ch.published)); // Only published chapters
    } catch (error) {
      console.error('Error loading story:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReadingProgress = async () => {
    try {
      const progressData = await api.getReadingProgress();
      const currentProgress = progressData.find(
        p => p.story && p.story._id === storyId && p.chapter && p.chapter._id === chapterId
      );
      if (currentProgress) {
        setReadingProgress(currentProgress);
        setProgress(currentProgress.progress);
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  };

  const updateProgress = async (newProgress) => {
    if (!currentChapter) return;

    try {
      const updatedProgress = await api.updateReadingProgress(
        storyId,
        currentChapter._id,
        newProgress
      );
      setReadingProgress(updatedProgress);
      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;  // Skip if programmatic

    const element = document.getElementById('chapter-content');
    if (element) {
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const newProgress = Math.round((scrollTop / scrollHeight) * 100);
      if (newProgress !== progress && newProgress >= 0 && newProgress <= 100) {
        setProgress(newProgress);
        // Debounce progress updates to avoid too many API calls
        updateProgressDebounced(newProgress);
      }
    }
  };

  // Debounced progress update
  const updateProgressDebounced = useCallback(
    debounce(async (newProgress) => {
      await updateProgress(newProgress);
    }, 2000),
    [currentChapter]
  );

  const goToChapter = (chapter) => {
    setCurrentChapter(chapter);
    navigate(`/read/${storyId}/${chapter._id}`);
  };

  const goToNextChapter = () => {
    const currentIndex = chapters.findIndex(ch => ch._id === currentChapter._id);
    if (currentIndex < chapters.length - 1) {
      const nextChapter = chapters[currentIndex + 1];
      goToChapter(nextChapter);
    }
  };

  const goToPreviousChapter = () => {
    const currentIndex = chapters.findIndex(ch => ch._id === currentChapter._id);
    if (currentIndex > 0) {
      const prevChapter = chapters[currentIndex - 1];
      goToChapter(prevChapter);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-base-content/70">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story || !currentChapter) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error">Story or chapter not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm border-b border-base-300 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          {/* Mobile: Stack vertically; Tablet+: Side by side */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-base-content/70 hover:text-base-content text-xs sm:text-sm md:text-base whitespace-nowrap shrink-0"
                aria-label="Back to Home"
              >
                ← <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3">
                <img 
                  src={story.coverImage || 'https://via.placeholder.com/40x40?text=Book'} 
                  alt={`${story.title} cover`}
                  className="object-cover rounded-full shrink-0"
                  style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/40x40?text=Book'}
                />
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-base-content truncate">{story.title}</h1>
                  <p className="text-xs sm:text-sm text-base-content/70 truncate">by {story.author?.name || 'Unknown Author'}</p>
                </div>
              </div>
            </div>

            {/* Progress Section - Horizontal on mobile, enhanced on larger screens */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
              <div className="text-xs sm:text-sm text-base-content/70 whitespace-nowrap">
                Ch {currentChapter.chapterNumber}/{chapters.length}
              </div>
              <div className="w-20 sm:w-24 md:w-32 lg:w-40 bg-base-300 rounded-full h-1.5 sm:h-2 shrink-0">
                <div
                  className="bg-primary h-1.5 sm:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-base-content/70 w-8 sm:w-10 text-right">{progress}%</span>
            </div>
          </div>

          {/* Chapter Navigation */}
          <div className="mt-3 sm:mt-4">
            {/* Mobile: Stack buttons, hide chapter list; Tablet+: Show all */}
            <div className="flex items-center justify-between gap-2 mb-3 md:hidden">
              <button
                onClick={goToPreviousChapter}
                disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === 0}
                className="px-3 py-2 text-xs sm:text-sm bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-11 touch-manipulation"
                aria-label="Previous Chapter"
              >
                ← Prev
              </button>

              {/* Mobile dropdown for chapter selection */}
              <select
                value={currentChapter._id}
                onChange={(e) => {
                  const chapter = chapters.find(ch => ch._id === e.target.value);
                  if (chapter) goToChapter(chapter);
                }}
                className="flex-1 px-2 py-2 text-xs sm:text-sm bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-11"
              >
                {chapters.map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>
                    Ch {chapter.chapterNumber}: {chapter.title || 'Untitled'}
                  </option>
                ))}
              </select>

              <button
                onClick={goToNextChapter}
                disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === chapters.length - 1}
                className="px-3 py-2 text-xs sm:text-sm bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-11 touch-manipulation"
                aria-label="Next Chapter"
              >
                Next →
              </button>
            </div>

            {/* Tablet+ Layout */}
            <div className="hidden md:flex items-center justify-between gap-3 lg:gap-4">
              <button
                onClick={goToPreviousChapter}
                disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === 0}
                className="px-4 py-2 text-sm lg:text-base bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                aria-label="Previous Chapter"
              >
                ← Previous
              </button>

              <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2 flex-1">
                {chapters.map((chapter) => (
                  <button
                    key={chapter._id}
                    onClick={() => goToChapter(chapter)}
                    className={`px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm whitespace-nowrap shrink-0 transition-colors ${
                      chapter._id === currentChapter._id
                        ? 'bg-primary text-primary-content font-semibold'
                        : 'bg-base-200 text-base-content hover:bg-base-300'
                    }`}
                    aria-label={`Go to chapter ${chapter.chapterNumber}`}
                    aria-current={chapter._id === currentChapter._id ? 'page' : undefined}
                  >
                    {chapter.chapterNumber}. {chapter.title || 'Untitled'}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextChapter}
                disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === chapters.length - 1}
                className="px-4 py-2 text-sm lg:text-base bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                aria-label="Next Chapter"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <motion.div
          key={currentChapter._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-base-100 rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-base-content mb-4 sm:mb-6">
              Chapter {currentChapter.chapterNumber}: {currentChapter.title}
            </h2>

            <div
              id="chapter-content"
              onScroll={handleScroll}
              className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none leading-relaxed text-base-content [&>p]:wrap-break-word"
              style={{
                maxHeight: window.innerWidth < 640 ? '55vh' : window.innerWidth < 1024 ? '65vh' : '70vh',
                overflowY: 'auto',
                paddingRight: '0.5rem'
              }}
            >
              {currentChapter.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Chapter Navigation Footer */}
          <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
            <button
              onClick={goToPreviousChapter}
              disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === 0}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base bg-base-200 text-base-content rounded-lg hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-11 sm:min-h-12 touch-manipulation transition-colors"
              aria-label="Previous Chapter"
            >
              ← Previous Chapter
            </button>

            <button
              onClick={goToNextChapter}
              disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === chapters.length - 1}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 text-sm sm:text-base bg-primary text-primary-content rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold min-h-11 sm:min-h-12 touch-manipulation transition-colors"
              aria-label="Next Chapter"
            >
              Next Chapter →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Read;