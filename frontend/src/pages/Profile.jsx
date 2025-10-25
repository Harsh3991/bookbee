import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import StoryCard from '../components/StoryCard';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stories');
  const [userStories, setUserStories] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'stories', label: 'My Stories', count: userStories.length },
    { id: 'reading', label: 'Reading History', count: readingHistory.length },
    { id: 'bookmarks', label: 'Library', count: bookmarks.length }
  ];

  const renderStoriesTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {userStories.length > 0 ? (
        userStories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
          <p className="text-gray-600 mb-4">Start your writing journey by creating your first story.</p>
          <button
            onClick={() => navigate('/write')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Write Your First Story
          </button>
        </div>
      )}
    </div>
  );

  const renderReadingHistoryTab = () => (
    <div className="space-y-4">
      {readingHistory.length > 0 ? (
        readingHistory.map((progress) => (
          <motion.div
            key={`${progress.story._id}-${progress.chapter._id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {progress.story.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  Chapter {progress.chapter.chapterNumber}: {progress.chapter.title}
                </p>
                <p className="text-sm text-gray-500">
                  by {progress.story.author?.name || 'Unknown Author'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-2">
                  Progress: {progress.progress}%
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
                <button
                  onClick={() => navigate(`/read/${progress.story._id}/${progress.chapter._id}`)}
                  className="mt-3 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  Continue Reading →
                </button>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reading history</h3>
          <p className="text-gray-600 mb-4">Start reading stories to track your progress here.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Browse Stories
          </button>
        </div>
      )}
    </div>
  );

  const renderBookmarksTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <StoryCard key={bookmark.story._id} story={bookmark.story} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 mb-4">Bookmark stories you want to read later.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Discover Stories
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-24 h-24 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </motion.div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h1>
              <p className="text-gray-600 mb-4">{user?.bio || 'Welcome to BookBee! Start your reading and writing journey.'}</p>
              <div className="flex space-x-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userStories.length}</div>
                  <div className="text-gray-500">Stories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{readingHistory.length}</div>
                  <div className="text-gray-500">Reading</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{bookmarks.length}</div>
                  <div className="text-gray-500">Bookmarks</div>
                </div>
              </div>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-400 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
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