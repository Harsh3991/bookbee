import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const StoryEditor = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    genres: [],
    tags: [],
    status: 'ongoing'
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (storyId) {
      loadStoryData();
    }
  }, [storyId, location.key]); // Reload data when storyId changes or when navigating back to this page

  const loadStoryData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const [storyData, chaptersData] = await Promise.all([
        api.getStoryById(storyId),
        api.getChapters(storyId)
      ]);

      // Check if user is the author
      if (storyData.author._id !== user._id) {
        setError('You do not have permission to edit this story');
        return;
      }

      setStory(storyData);
      setChapters(chaptersData);
      setEditForm({
        title: storyData.title || '',
        description: storyData.description || '',
        genres: storyData.genres || [],
        tags: storyData.tags || [],
        status: storyData.status || 'ongoing'
      });
    } catch (err) {
      setError(err.message || 'Failed to load story data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setEditForm(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag && !editForm.tags.includes(tag)) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      await api.updateStory(storyId, editForm);
      setSaveSuccess(true);
      setIsEditing(false);
      // Refresh story data
      await loadStoryData();
    } catch (err) {
      setSaveError(err.message || 'Failed to update story');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: story.title || '',
      description: story.description || '',
      genres: story.genres || [],
      tags: story.tags || [],
      status: story.status || 'ongoing'
    });
    setIsEditing(false);
    setSaveError('');
    setSaveSuccess(false);
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) {
      try {
        await api.deleteChapter(chapterId);
        // Reload data to reflect changes
        await loadStoryData();
      } catch (err) {
        console.error('Failed to delete chapter:', err);
        alert('Failed to delete chapter. Please try again.');
      }
    }
  };

  const availableGenres = ['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Horror', 'Adventure', 'Drama', 'Comedy'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading story editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Image */}
            <div className="shrink-0">
              <img
                src={story.coverImage || 'https://picsum.photos/300/400?random=1'}
                alt={story.title}
                className="w-48 h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Story Details */}
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{story.title}</h1>
                      <p className="text-gray-600 mb-2">by {story.author?.name || 'Unknown Author'}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(story.createdAt).toLocaleDateString()} |
                        Status: <span className="capitalize font-medium">{story.status}</span>
                      </p>
                    </div>
                    <button
                      onClick={handleEditToggle}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Edit Story Details
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4">{story.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium">Genres:</span>{' '}
                      {story.genres?.length > 0 ? story.genres.join(', ') : 'None'}
                    </div>
                    <div>
                      <span className="font-medium">Tags:</span>{' '}
                      {story.tags?.length > 0 ? story.tags.join(', ') : 'None'}
                    </div>
                  </div>

                  <div className="flex gap-6 mt-4 text-sm text-gray-600">
                    <span>Views: {story.views || 0}</span>
                    <span>Likes: {story.likes || 0}</span>
                    <span>Rating: {story.rating || 0} ★</span>
                    <span>Reviews: {story.reviewCount || 0}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => handleEditFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => handleEditFormChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Genres</label>
                    <div className="flex flex-wrap gap-2">
                      {availableGenres.map(genre => (
                        <button
                          key={genre}
                          onClick={() => handleGenreToggle(genre)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            editForm.genres.includes(genre)
                              ? 'bg-yellow-400 text-black'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editForm.tags.map(tag => (
                        <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => handleTagRemove(tag)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleTagAdd(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="hiatus">Hiatus</option>
                    </select>
                  </div>

                  {saveError && <div className="text-red-600 mb-4">{saveError}</div>}
                  {saveSuccess && <div className="text-green-600 mb-4">Story updated successfully!</div>}

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Chapters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Chapters ({chapters.length})</h2>
              {refreshing && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  Refreshing...
                </div>
              )}
              <button
                onClick={() => loadStoryData(true)}
                disabled={refreshing}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 flex items-center gap-1"
                title="Refresh chapters"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            <button
              onClick={() => navigate(`/add-chapter/${storyId}`)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Add New Chapter
            </button>
          </div>

          {chapters.length > 0 ? (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <motion.div
                  key={chapter._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-gray-900">
                        Chapter {chapter.chapterNumber}
                      </span>
                      <span className="text-gray-700">{chapter.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        chapter.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {chapter.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Created: {new Date(chapter.createdAt).toLocaleDateString()} |
                      Views: {chapter.views || 0}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/read/${storyId}/${chapter._id}`)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {/* Edit chapter - could navigate to edit page */}}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter._id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters yet</h3>
              <p className="text-gray-600 mb-4">Start building your story by adding your first chapter.</p>
              <button
                onClick={() => navigate(`/add-chapter/${storyId}`)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Add First Chapter
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StoryEditor;