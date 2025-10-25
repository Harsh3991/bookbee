import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';

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
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [readingProgress, setReadingProgress] = useState(null);

  useEffect(() => {
    loadStoryAndChapters();
  }, [storyId]);

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
    if (currentChapter && readingProgress && progress > 0) {
      setTimeout(() => {
        const element = document.getElementById('chapter-content');
        if (element) {
          const scrollHeight = element.scrollHeight - element.clientHeight;
          const scrollPosition = (progress / 100) * scrollHeight;
          element.scrollTop = scrollPosition;
        }
      }, 500); // Small delay to ensure content is rendered
    }
  }, [currentChapter, readingProgress, progress]);

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
        p => p.story._id === storyId && p.chapter._id === chapterId
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story || !currentChapter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Story or chapter not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{story.title}</h1>
                <p className="text-sm text-gray-600">by {story.author?.name || 'Unknown Author'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Chapter {currentChapter.chapterNumber} of {chapters.length}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
          </div>

          {/* Chapter Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={goToPreviousChapter}
              disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex space-x-2 overflow-x-auto">
              {chapters.map((chapter) => (
                <button
                  key={chapter._id}
                  onClick={() => goToChapter(chapter)}
                  className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                    chapter._id === currentChapter._id
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {chapter.chapterNumber}. {chapter.title || 'Untitled'}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextChapter}
              disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === chapters.length - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={currentChapter._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Chapter {currentChapter.chapterNumber}: {currentChapter.title}
            </h2>

            <div
              id="chapter-content"
              onScroll={handleScroll}
              className="prose prose-lg max-w-none leading-relaxed text-gray-800"
              style={{
                maxHeight: '70vh',
                overflowY: 'auto',
                paddingRight: '1rem'
              }}
            >
              {currentChapter.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Chapter Navigation Footer */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousChapter}
              disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous Chapter
            </button>

            <button
              onClick={goToNextChapter}
              disabled={chapters.findIndex(ch => ch._id === currentChapter._id) === chapters.length - 1}
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
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