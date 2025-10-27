import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const AddChapter = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (storyId) {
      loadStoryAndChapters();
    }
  }, [storyId]);

  const loadStoryAndChapters = async () => {
    try {
      setLoading(true);
      setError('');

      const [storyData, chaptersData] = await Promise.all([
        api.getStoryById(storyId),
        api.getChapters(storyId)
      ]);

      // Check if user is the author
      if (storyData.author._id !== user._id) {
        setError('You do not have permission to add chapters to this story');
        return;
      }

      setStory(storyData);
      setChapters(chaptersData);
    } catch (err) {
      setError(err.message || 'Failed to load story data');
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

      // Calculate next chapter number
      const nextChapterNumber = chapters.length > 0
        ? Math.max(...chapters.map(c => c.chapterNumber)) + 1
        : 1;

      const chapterData = {
        title: formData.title,
        content: formData.content,
        published: true
      };

      await api.createChapter(storyId, chapterData);

      // Redirect back to story editor
      navigate(`/story-editor/${storyId}`);
    } catch (err) {
      setSaveError(err.message || 'Failed to create chapter');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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

  const nextChapterNumber = chapters.length > 0
    ? Math.max(...chapters.map(c => c.chapterNumber)) + 1
    : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="mb-6">
            <button
              onClick={() => navigate(`/story-editor/${storyId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Story Editor
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Chapter</h1>
            <p className="text-gray-600">
              Adding Chapter {nextChapterNumber} to "{story.title}"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter chapter title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Content *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your chapter content here..."
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-vertical"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Tip: You can edit and publish this chapter later from the story editor.
              </p>
            </div>

            {saveError && (
              <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                {saveError}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-6 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Creating Chapter...
                  </div>
                ) : (
                  'Create Chapter'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/story-editor/${storyId}`)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
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

export default AddChapter;