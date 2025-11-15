import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import StoryCard from '../components/StoryCard';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stories');
  const [userStories, setUserStories] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (user) {
      setEditingName(user.name || '');
    }
  }, [user]);

  const loadProfileData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const [storiesData, progressData, bookmarksData] = await Promise.all([
        api.getUserStories(user._id),
        api.getReadingProgress(),
        api.getBookmarks()
      ]);

      setUserStories(storiesData);
      setReadingHistory(progressData);
      setBookmarks(bookmarksData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadProfileData(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingName(user?.name || '');
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      const updatedUser = await api.updateUserProfile({
        name: editingName.trim(),
      });

      updateUser(updatedUser);
      setIsEditing(false);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'stories', label: 'My Stories', count: userStories.length },
    { id: 'reading', label: 'Reading History', count: readingHistory.length },
    { id: 'bookmarks', label: 'Library', count: bookmarks.length }
  ];

  const renderStoriesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {userStories.length > 0 ? (
        userStories.map((story, index) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <StoryCard 
              story={story} 
              showEditButton={true}
              onEdit={(story) => navigate(`/story-editor/${story._id}`)}
            />
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-full"
        >
          <div className="bg-base-100 rounded-3xl shadow-lg border border-base-300 p-16 text-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-gray-300 mb-6"
            >
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-base-content mb-3">No stories yet</h3>
            <p className="text-base-content/70 mb-8 text-lg max-w-md mx-auto">Start your writing journey by creating your first story and share it with the world.</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/write')}
              className="bg-primary hover:bg-primary/90 text-primary-content px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Write Your First Story</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderReadingHistoryTab = () => (
    <div className="space-y-6">
      {readingHistory.length > 0 ? (
        readingHistory
          .filter((progress) => progress.story && progress.chapter) // Filter out invalid entries
          .map((progress, index) => (
            <motion.div
              key={`${progress.story._id}-${progress.chapter._id}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-base-100 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border border-base-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors truncate">
                    {progress.story.title}
                  </h3>
                  <p className="text-base-content/90 mb-2 font-medium">
                    Chapter {progress.chapter.chapterNumber}: {progress.chapter.title}
                  </p>
                  <p className="text-sm text-base-content/60 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>by {progress.story.author?.name || 'Unknown Author'}</span>
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-base-content/70 mb-3">
                      Reading Progress
                    </div>
                    <div className="relative w-32 h-32">
                      {/* Circular progress */}
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-base-300"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                          animate={{ 
                            strokeDashoffset: 2 * Math.PI * 56 * (1 - (progress.progress || 0) / 100)
                          }}
                          transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                          className="text-primary"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-base-content">{progress.progress || 0}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/read/${progress.story._id}/${progress.chapter._id}`)}
                    className="bg-primary hover:bg-primary/90 text-primary-content px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>Continue Reading</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-base-100 rounded-3xl shadow-lg border border-base-300 p-16 text-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-base-content/20 mb-6"
            >
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-base-content mb-3">No reading history</h3>
            <p className="text-base-content/70 mb-8 text-lg max-w-md mx-auto">Start reading amazing stories and track your progress here.</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-secondary hover:bg-secondary/90 text-secondary-content px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse Stories</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderBookmarksTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark, index) => (
          <motion.div
            key={bookmark.story._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <StoryCard story={bookmark.story} />
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-full"
        >
          <div className="bg-base-100 rounded-3xl shadow-lg border border-base-300 p-16 text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-base-content/20 mb-6"
            >
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-base-content mb-3">No bookmarks yet</h3>
            <p className="text-base-content/70 mb-8 text-lg max-w-md mx-auto">Bookmark your favorite stories to save them for later reading.</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-neutral hover:bg-neutral/90 text-neutral-content px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span>Discover Stories</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="relative mx-auto w-20 h-20 mb-6"
          >
            <div className="absolute inset-0 rounded-full border-4 border-base-300"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"></div>
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl font-semibold text-base-content"
          >
            Loading your profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-base-100 rounded-3xl shadow-2xl p-12 text-center border border-error">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: 3,
                repeatDelay: 1
              }}
              className="text-red-500 mb-6"
            >
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-base-content mb-3">Oops! Something went wrong</h3>
            <p className="text-base-content/70 mb-8 text-lg">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-content px-8 py-3.5 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              {refreshing && (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{refreshing ? 'Retrying...' : 'Try Again'}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-4 sm:py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-base-100 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 md:mb-10 border border-base-300 overflow-hidden relative"
        >
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/10 rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32 opacity-50"></div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8 relative z-10">
            {/* Enhanced Avatar */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative shrink-0"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-primary rounded-full flex items-center justify-center text-primary-content text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold shadow-2xl ring-2 sm:ring-4 ring-base-100 ring-offset-2 sm:ring-offset-4 ring-offset-base-200">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {/* Decorative pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-primary/20"
              ></motion.div>
            </motion.div>

            <div className="flex-1 min-w-0 w-full sm:w-auto text-center sm:text-left">
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content bg-transparent border-b-2 border-base-300 focus:border-primary focus:outline-none w-full transition-colors pb-2 text-center sm:text-left"
                    placeholder="Enter your name"
                  />
                  <p className="text-base-content/70 text-sm sm:text-base md:text-lg px-2 sm:px-0">{user?.bio || 'Welcome to BookBee! Start your reading and writing journey.'}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-2 sm:mb-3 tracking-tight wrap-break-word">{user?.name || 'User'}</h1>
                  <p className="text-base-content/70 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 px-2 sm:px-0">{user?.bio || 'Welcome to BookBee! Start your reading and writing journey.'}</p>
                </motion.div>
              )}
              
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-4 sm:mt-5 md:mt-6">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-primary/10 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-primary/20 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-0.5 sm:mb-1">{userStories.length}</div>
                  <div className="text-xs sm:text-sm font-medium text-base-content/70 leading-tight">Stories Written</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-secondary/10 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-secondary/20 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary mb-0.5 sm:mb-1">{readingHistory.length}</div>
                  <div className="text-xs sm:text-sm font-medium text-base-content/70 leading-tight">Currently Reading</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-neutral/10 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-neutral/20 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral mb-0.5 sm:mb-1">{bookmarks.length}</div>
                  <div className="text-xs sm:text-sm font-medium text-base-content/70 leading-tight">Saved Stories</div>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex sm:flex-col flex-row w-full sm:w-auto space-x-2 sm:space-x-0 sm:space-y-3 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none bg-base-100 hover:bg-base-200 disabled:bg-base-200 text-base-content disabled:text-base-content/40 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg border border-base-300"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                <span className="sm:hidden">{refreshing ? '...' : 'Refresh'}</span>
              </motion.button>
              
              {isEditing ? (
                <div className="flex sm:flex-col flex-row w-full sm:w-auto space-x-2 sm:space-x-0 sm:space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-content px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    {saving && (
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 sm:flex-none bg-base-100 hover:bg-base-200 disabled:bg-base-200 text-base-content disabled:text-base-content/40 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all disabled:cursor-not-allowed shadow-md border border-base-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-content px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-success/20 border-2 border-success text-success-content px-6 py-4 rounded-2xl mb-8 flex items-center space-x-3 shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="w-8 h-8 bg-success rounded-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <span className="font-semibold text-lg">Profile updated successfully!</span>
          </motion.div>
        )}

        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-error/20 border-2 border-error text-error-content px-6 py-4 rounded-2xl mb-8 flex items-center space-x-3 shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="w-8 h-8 bg-error rounded-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <span className="font-semibold text-lg">{saveError}</span>
          </motion.div>
        )}

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-base-100 rounded-2xl shadow-lg mb-10 border border-base-300 overflow-hidden"
        >
          <nav className="flex relative">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-8 py-5 text-base font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                {/* Active tab indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  />
                )}
                
                {/* Tab background on active */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBg"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute inset-0 bg-primary/10"
                  />
                )}
                
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-bold ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-300 text-base-content/70'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'stories' && renderStoriesTab()}
          {activeTab === 'reading' && renderReadingHistoryTab()}
          {activeTab === 'bookmarks' && renderBookmarksTab()}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;