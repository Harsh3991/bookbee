import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Write = () => {
  const { id } = useParams(); // story id for editing
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Story metadata
  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    coverImage: '',
    genres: [],
    tags: [],
    status: 'ongoing'
  });

  // Cover upload
  const [coverFile, setCoverFile] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Chapters
  const [chapters, setChapters] = useState([
    { title: '', content: '', chapterNumber: 1, published: false }
  ]);

  const [currentChapter, setCurrentChapter] = useState(0);

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  useEffect(() => {
    if (id) {
      // Load existing story for editing
      loadStory(id);
    }
  }, [id]);

  useEffect(() => {
    // Auto-save every 30 seconds
    if (storyData.title || chapters[0].content) {
      const timer = setTimeout(() => {
        autoSave();
      }, 30000);
      setAutoSaveTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [storyData, chapters]);

  const loadStory = async (storyId) => {
    try {
      setLoading(true);
      const story = await api.getStoryById(storyId);
      setStoryData({
        title: story.title,
        description: story.description,
        coverImage: story.coverImage,
        genres: story.genres || [],
        tags: story.tags || [],
        status: story.status
      });

      // Load chapters
      const storyChapters = await api.getChapters(storyId);
      if (storyChapters.length > 0) {
        setChapters(storyChapters.map((ch, index) => ({
          ...ch,
          chapterNumber: index + 1
        })));
      }
    } catch (error) {
      console.error('Error loading story:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    if (!storyData.title && !chapters[0].content) return;

    try {
      setSaving(true);
      const dataToSave = {
        title: storyData.title,
        description: storyData.description,
        genres: storyData.genres,
        tags: storyData.tags,
        status: 'ongoing'
      };

      if (id) {
        await api.updateStory(id, dataToSave);
      } else {
        const newStory = await api.createStory(dataToSave);
        navigate(`/write/${newStory._id}`, { replace: true });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleStoryDataChange = (field, value) => {
    setStoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setStoryData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag && !storyData.tags.includes(tag)) {
      setStoryData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleCoverUpload = async (file) => {
    if (!id) return; // Can only upload cover for existing stories

    try {
      setUploadingCover(true);
      const result = await api.uploadCover(id, file);
      setStoryData(prev => ({
        ...prev,
        coverImage: result.coverImage
      }));
      setCoverFile(null);
    } catch (error) {
      console.error('Error uploading cover:', error);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setStoryData(prev => ({
          ...prev,
          coverImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addChapter = () => {
    setChapters(prev => [...prev, {
      title: '',
      content: '',
      chapterNumber: prev.length + 1,
      published: false
    }]);
    setCurrentChapter(chapters.length);
  };

  const updateChapter = (index, field, value) => {
    setChapters(prev => prev.map((chapter, i) =>
      i === index ? { ...chapter, [field]: value } : chapter
    ));
  };

  const publishStory = async () => {
    try {
      setLoading(true);

      let storyId = id;

      // Create story if it doesn't exist
      if (!storyId) {
        const newStory = await api.createStory({
          title: storyData.title,
          description: storyData.description,
          genres: storyData.genres,
          tags: storyData.tags,
          status: 'ongoing'
        });
        storyId = newStory._id;
      } else {
        // Update existing story
        await api.updateStory(storyId, {
          title: storyData.title,
          description: storyData.description,
          genres: storyData.genres,
          tags: storyData.tags,
          status: 'ongoing'
        });
      }

      // Upload cover if selected
      if (coverFile && storyId) {
        await handleCoverUpload(coverFile);
      }

      // Create/update chapters
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        if (chapter.content.trim()) {
          if (chapter._id) {
            // Update existing chapter
            await api.updateChapter(chapter._id, {
              title: chapter.title,
              content: chapter.content,
              chapterNumber: i + 1
            });
            // Publish the chapter
            await api.publishChapter(chapter._id);
          } else {
            // Create new chapter
            const newChapter = await api.createChapter(storyId, {
              title: chapter.title,
              content: chapter.content,
              chapterNumber: i + 1
            });
            // Publish the chapter
            await api.publishChapter(newChapter._id);
          }
        }
      }

      navigate('/');
    } catch (error) {
      console.error('Error publishing story:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Story Details', description: 'Basic information about your story' },
    { number: 2, title: 'Write Chapters', description: 'Create and edit your story chapters' },
    { number: 3, title: 'Review & Publish', description: 'Final review and publishing options' }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Edit Story' : 'Write New Story'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {saving && (
                <span className="text-sm text-gray-500">Auto-saving...</span>
              )}
              <button
                onClick={autoSave}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button
                onClick={publishStory}
                disabled={loading}
                className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Story'}
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number
                    ? 'bg-yellow-400 text-black'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-yellow-400' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                value={storyData.title}
                onChange={(e) => handleStoryDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your story title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={storyData.description}
                onChange={(e) => handleStoryDataChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Write a compelling description for your story"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                >
                  Choose File
                </label>
                {uploadingCover && <span className="text-sm text-gray-500">Uploading...</span>}
                {storyData.coverImage && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={storyData.coverImage}
                      alt="Cover preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setStoryData(prev => ({ ...prev, coverImage: '' }))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload a cover image for your story (optional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Horror', 'Adventure', 'Drama', 'Comedy'].map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      storyData.genres.includes(genre)
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {storyData.tags.map(tag => (
                  <span key={tag} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleTagAdd(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Add tags (press Enter)"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!storyData.title || !storyData.description}
                className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Write Chapters
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Chapter Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {chapters.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChapter(index)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      currentChapter === index
                        ? 'bg-yellow-400 text-black'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Chapter {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={addChapter}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                + Add Chapter
              </button>
            </div>

            {/* Current Chapter Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapters[currentChapter]?.title || ''}
                  onChange={(e) => updateChapter(currentChapter, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Chapter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter Content
                </label>
                <textarea
                  value={chapters[currentChapter]?.content || ''}
                  onChange={(e) => updateChapter(currentChapter, 'content', e.target.value)}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-mono text-sm"
                  placeholder="Start writing your story..."
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Details
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
              >
                Review & Publish
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Story Preview</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Story Details</h4>
                  <p><strong>Title:</strong> {storyData.title}</p>
                  <p><strong>Description:</strong> {storyData.description}</p>
                  <p><strong>Genres:</strong> {storyData.genres.join(', ')}</p>
                  <p><strong>Tags:</strong> {storyData.tags.join(', ')}</p>
                  <p><strong>Chapters:</strong> {chapters.length}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Chapter Summary</h4>
                  {chapters.map((chapter, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-sm">
                        <strong>Chapter {index + 1}:</strong> {chapter.title || 'Untitled'}
                        ({chapter.content.length} characters)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Writing
              </button>
              <button
                onClick={publishStory}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Story'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Write;