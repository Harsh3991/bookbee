import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const EditChapter = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/edit-chapter/${storyId}/${chapterId}`);
    }
  }, [isAuthenticated, navigate, storyId, chapterId]);

  useEffect(() => {
    if (storyId && chapterId && isAuthenticated) {
      loadData();
    }
  }, [storyId, chapterId, isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [storyData, chapterData] = await Promise.all([
        api.getStoryById(storyId),
        api.getChapterById(chapterId)
      ]);

      // Check if user is the author
      if (storyData.author._id !== user._id) {
        setError('You do not have permission to edit this chapter');
        return;
      }

      setStory(storyData);
      setChapter(chapterData);
      setFormData({
        title: chapterData.title || '',
        content: chapterData.content || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load chapter data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setSaveError('Please fill in both title and content');
      return;
    }

    try {
      setSaving(true);
      setSaveError('');

      const chapterData = {
        title: formData.title,
        content: formData.content
      };

      await api.updateChapter(chapterId, chapterData);

      // Redirect back to story editor
      navigate(`/story-editor/${storyId}`);
    } catch (err) {
      setSaveError(err.message || 'Failed to update chapter');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-base-content/70">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error mb-4">{error}</div>
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

  if (!story || !chapter) return null;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-xl shadow-lg p-6"
        >
          <div className="mb-6">
            <button
              onClick={() => navigate(`/story-editor/${storyId}`)}
              className="flex items-center gap-2 text-base-content/70 hover:text-base-content mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Story Editor
            </button>

            <h1 className="text-2xl font-bold text-base-content mb-2">Edit Chapter</h1>
            <p className="text-base-content/70">
              Editing Chapter {chapter.chapterNumber} of "{story.title}"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-base-content mb-2">
                Chapter Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter chapter title..."
                className="w-full px-4 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-base-content mb-2">
                Chapter Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your chapter content here..."
                rows={20}
                className="w-full px-4 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                required
              />
              <p className="text-sm text-base-content/60 mt-1">
                Tip: You can edit and publish this chapter later from the story editor.
              </p>
            </div>

            {saveError && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{saveError}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-content px-6 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating Chapter...
                  </div>
                ) : (
                  'Update Chapter'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/story-editor/${storyId}`)}
                className="bg-base-200 hover:bg-base-300 text-base-content px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditChapter;