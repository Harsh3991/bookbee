import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const StoryEditor = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/story-editor/${storyId}`);
    }
  }, [isAuthenticated, navigate, storyId]);

  useEffect(() => {
    if (storyId && isAuthenticated) {
      loadStoryData();
    }
  }, [storyId, location.key, isAuthenticated]); // Reload data when storyId changes or when navigating back to this page

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
    if (confirm('Are you sure you want to delete this chapter?')) {
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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteError('');
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    
    try {
      await api.deleteStory(storyId);
      // Redirect to profile page after successful deletion
      navigate('/profile');
    } catch (err) {
      console.error('Failed to delete story:', err);
      setDeleteError(err.message || 'Failed to delete story. Please try again.');
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteError('');
  };

  const availableGenres = ['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Horror', 'Adventure', 'Drama', 'Comedy'];

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-base-content/70">Loading story editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-primary hover:bg-primary/90 text-primary-content px-6 py-2 rounded-lg font-semibold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!story) return null;

  return (
    <div className="min-h-screen bg-base-200">
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
                alt={story.title}
                className="w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-64 lg:w-52 lg:h-72 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Story Details */}
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-base-content mb-2 wrap-break-word">{story.title}</h1>
                      <p className="text-sm sm:text-base text-base-content/70 mb-2">by {story.author?.name || 'Unknown Author'}</p>
                      <p className="text-xs sm:text-sm text-base-content/60 flex flex-wrap gap-x-2 gap-y-1">
                        <span>Created: {new Date(story.createdAt).toLocaleDateString()}</span>
                        <span className="hidden sm:inline">|</span>
                        <span>Status: <span className="capitalize font-medium">{story.status}</span></span>
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={handleEditToggle}
                        className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-content px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-11 touch-manipulation"
                      >
                        Edit Story Details
                      </button>
                      {user && story.author._id === user._id && (
                        <div className="relative group">
                          <button
                            onClick={handleDeleteClick}
                            className="bg-base-200 hover:bg-red-100 text-base-content hover:text-red-600 p-2 sm:p-2.5 rounded-lg transition-colors min-h-11 min-w-11 flex items-center justify-center touch-manipulation"
                            aria-label="Delete story"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-base-content text-base-100 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Delete the story
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-base-content/80 mb-4 leading-relaxed wrap-break-word">{story.description}</p>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="wrap-break-word">
                      <span className="font-medium">Genres:</span>{' '}
                      {story.genres?.length > 0 ? story.genres.join(', ') : 'None'}
                    </div>
                    <div className="wrap-break-word">
                      <span className="font-medium">Tags:</span>{' '}
                      {story.tags?.length > 0 ? story.tags.join(', ') : 'None'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mt-4 text-xs sm:text-sm text-base-content/70">
                    <span>Views: {story.views || 0}</span>
                    <span>Likes: {story.likes || 0}</span>
                    <span>Rating: {story.rating || 0} ★</span>
                    <span>Reviews: {story.reviewCount || 0}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-base-content mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => handleEditFormChange('title', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-11"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-base-content mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => handleEditFormChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-base-content mb-2">Genres</label>
                    <div className="flex flex-wrap gap-2">
                      {availableGenres.map(genre => (
                        <button
                          key={genre}
                          onClick={() => handleGenreToggle(genre)}
                          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm min-h-9 touch-manipulation transition-colors ${
                            editForm.genres.includes(genre)
                              ? 'bg-primary text-primary-content font-semibold'
                              : 'bg-base-200 text-base-content hover:bg-base-300'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-base-content mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editForm.tags.map(tag => (
                        <span key={tag} className="bg-base-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => handleTagRemove(tag)}
                            className="text-base-content/50 hover:text-error text-base sm:text-lg min-h-5 min-w-5 touch-manipulation"
                            aria-label={`Remove tag ${tag}`}
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
                      className="w-full px-3 py-2 text-sm sm:text-base border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-11"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-base-content mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-11"
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="hiatus">Hiatus</option>
                    </select>
                  </div>

                  {saveError && <div className="text-red-600 mb-4 text-xs sm:text-sm">{saveError}</div>}
                  {saveSuccess && <div className="text-green-600 mb-4 text-xs sm:text-sm">Story updated successfully!</div>}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-content px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-11 touch-manipulation"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full sm:w-auto bg-base-200 hover:bg-base-300 text-base-content px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-11 touch-manipulation"
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
          className="bg-base-100 rounded-xl shadow-lg p-4 sm:p-5 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                Chapters ({chapters.length})
              </h2>
              {refreshing && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-base-content/50">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary"></div>
                  Refreshing...
                </div>
              )}
              <button
                onClick={() => loadStoryData(true)}
                disabled={refreshing}
                className="text-xs sm:text-sm text-base-content/50 hover:text-base-content/70 disabled:opacity-50 flex items-center gap-1 touch-manipulation"
                title="Refresh chapters"
                aria-label="Refresh chapters"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
            <button
              onClick={() => navigate(`/add-chapter/${storyId}`)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-content px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-11 touch-manipulation"
            >
              <span className="hidden sm:inline">Add New Chapter</span>
              <span className="sm:hidden">+ Add Chapter</span>
            </button>
          </div>

          {chapters.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {chapters.map((chapter) => (
                <motion.div
                  key={chapter._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="text-base sm:text-lg font-semibold text-base-content shrink-0">
                        Chapter {chapter.chapterNumber}
                      </span>
                      <span className="text-sm sm:text-base text-base-content/70 truncate">{chapter.title}</span>
                      <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs shrink-0 w-fit ${
                        chapter.published ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                      }`}>
                        {chapter.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-base-content/50 mt-1 sm:mt-2 flex flex-wrap gap-x-2 gap-y-1">
                      <span>Created: {new Date(chapter.createdAt).toLocaleDateString()}</span>
                      <span className="hidden sm:inline">|</span>
                      <span>Views: {chapter.views || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 shrink-0">
                    <button
                      onClick={() => navigate(`/read/${storyId}/${chapter._id}`)}
                      className="flex-1 sm:flex-none px-3 py-1.5 sm:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs sm:text-sm min-h-9 sm:min-h-10 touch-manipulation transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        if (story.author._id !== user._id) {
                          alert('You do not have permission to edit this chapter');
                          return;
                        }
                        navigate(`/edit-chapter/${storyId}/${chapter._id}`);
                      }}
                      className="flex-1 sm:flex-none px-3 py-1.5 sm:py-2 bg-base-200 hover:bg-base-300 text-base-content rounded text-xs sm:text-sm min-h-9 sm:min-h-10 touch-manipulation transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter._id)}
                      className="flex-1 sm:flex-none px-3 py-1.5 sm:py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs sm:text-sm min-h-9 sm:min-h-10 touch-manipulation transition-colors"
                    >
                      Delete
                    </button>
                  </div>
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
              <h3 className="text-base sm:text-lg font-medium text-base-content mb-2">No chapters yet</h3>
              <p className="text-sm sm:text-base text-base-content/60 mb-4">Start building your story by adding your first chapter.</p>
              <button
                onClick={() => navigate(`/add-chapter/${storyId}`)}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-content px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base min-h-11 touch-manipulation"
              >
                Add First Chapter
              </button>
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-base-100 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-error/10 text-error p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-base-content">Delete Story</h3>
              </div>
              
              <p className="text-base-content/80 mb-6">
                Are you sure you want to delete this story? This action cannot be undone and will also delete all chapters.
              </p>

              {deleteError && (
                <div className="alert alert-error mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="btn btn-ghost flex-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="btn btn-error flex-1"
                >
                  {deleting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryEditor;