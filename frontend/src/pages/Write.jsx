import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Write = () => {
  const { id } = useParams(); // story id for editing
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

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

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/write${id ? `/${id}` : ''}`);
    }
  }, [isAuthenticated, navigate, id]);

  useEffect(() => {
    if (id && isAuthenticated) {
      // Load existing story for editing
      loadStory(id);
    }
  }, [id, isAuthenticated]);

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

  const handleCoverUpload = async (file, storyId = id) => {
    if (!storyId) return; // Can only upload cover for existing stories

    try {
      setUploadingCover(true);
      const result = await api.uploadCover(storyId, file);
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
    
    // Update word count
    if (field === 'content') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setStoryData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
        await handleCoverUpload(coverFile, storyId);
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
    { 
      number: 1, 
      title: 'Story Details', 
      description: 'Craft your story\'s foundation',
      icon: '📖'
    },
    { 
      number: 2, 
      title: 'Write Chapters', 
      description: 'Bring your story to life',
      icon: '✍️'
    },
    { 
      number: 3, 
      title: 'Review & Publish', 
      description: 'Share your masterpiece',
      icon: '🚀'
    }
  ];

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
              <span className="text-2xl sm:text-3xl">✨</span>
            </div>
          </div>
          <p className="mt-6 text-base-content/70 text-base sm:text-lg font-serif">Loading your creative space...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header */}
      <div className="relative bg-base-100/80 backdrop-blur-md shadow-xl border-b border-base-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 w-full sm:w-auto">
              <motion.button
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-base-content/70 hover:text-primary transition-colors group touch-manipulation min-h-11"
              >
                <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-medium text-sm sm:text-base">Home</span>
              </motion.button>
              <div className="h-6 sm:h-8 w-px bg-base-300"></div>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-base-content tracking-wide leading-tight">
                  {id ? 'Refine Your Story' : 'Begin Your Journey'}
                </h1>
                <p className="text-xs sm:text-sm text-base-content/70 mt-0.5 sm:mt-1 font-light hidden sm:block">Every great story starts with a single word</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 w-full sm:w-auto">
              <AnimatePresence>
                {saving && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="hidden md:flex items-center space-x-2 text-xs sm:text-sm text-success"
                  >
                    <div className="animate-pulse">💾</div>
                    <span>Saving your work...</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={autoSave}
                className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-base-content bg-base-100 border border-base-300 rounded-lg sm:rounded-xl hover:bg-base-200 hover:border-primary transition-all duration-300 font-medium shadow-md backdrop-blur-sm text-xs sm:text-sm md:text-base touch-manipulation min-h-11"
              >
                <span className="hidden sm:inline">💾 Save Draft</span>
                <span className="sm:hidden">💾</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(250, 204, 21, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={publishStory}
                disabled={loading}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-primary hover:bg-primary/90 text-primary-content rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-xl relative overflow-hidden group text-xs sm:text-sm md:text-base touch-manipulation min-h-11"
              >
                <span className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                  <span>{loading ? '⏳' : '✨'}</span>
                  <span className="hidden sm:inline">{loading ? 'Publishing...' : 'Publish Story'}</span>
                  <span className="sm:hidden">{loading ? 'Publishing' : 'Publish'}</span>
                </span>
                <div className="absolute inset-0 bg-primary-focus opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Progress Steps */}
          <div className="mt-6 sm:mt-8 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 pb-2 scrollbar-hide">
            <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-4 min-w-max sm:min-w-0">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center shrink-0">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center relative group cursor-pointer"
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-500 relative ${
                      currentStep >= step.number
                        ? 'bg-primary text-primary-content shadow-2xl'
                        : 'bg-base-100 text-base-content/40 border-2 border-base-300'
                    }`}>
                      {currentStep > step.number ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xl sm:text-2xl"
                        >
                          ✓
                        </motion.span>
                      ) : (
                        <span className="text-xl sm:text-2xl">{step.icon}</span>
                      )}
                      {currentStep === step.number && (
                        <motion.div
                          layoutId="activeStep"
                          className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </div>
                    <div className="mt-2 sm:mt-3 text-center hidden sm:block">
                      <div className={`text-xs sm:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${
                        currentStep >= step.number ? 'text-base-content' : 'text-base-content/50'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-base-content/60 mt-0.5 sm:mt-1 font-light hidden lg:block">{step.description}</div>
                    </div>
                    {/* Mobile step title below icon */}
                    <div className="mt-1.5 text-center sm:hidden">
                      <div className={`text-xs font-semibold transition-colors duration-300 whitespace-nowrap ${
                        currentStep >= step.number ? 'text-base-content' : 'text-base-content/50'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="hidden sm:block mx-2 sm:mx-4 mb-6 sm:mb-8">
                      <motion.div 
                        className={`w-12 sm:w-20 lg:w-32 h-1 rounded-full transition-all duration-700 ${
                          currentStep > step.number 
                            ? 'bg-primary' 
                            : 'bg-base-300'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.2 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Inspirational Quote */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8 sm:mb-10 md:mb-12 px-4"
            >
              <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-base-content/80 leading-relaxed">
                "There is no greater agony than bearing an untold story inside you."
              </p>
              <p className="text-xs sm:text-sm text-base-content/60 mt-2">— Maya Angelou</p>
            </motion.div>

            <div className="bg-base-100 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-base-300 shadow-xl">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <label className="text-sm sm:text-base font-semibold text-base-content mb-2 sm:mb-3 flex items-center space-x-2">
                    <span className="text-lg sm:text-xl">📚</span>
                    <span>Story Title *</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={storyData.title}
                    onChange={(e) => handleStoryDataChange('title', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-base-200 border-2 border-base-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base-content placeholder-base-content/40 text-base sm:text-lg font-serif touch-manipulation"
                    placeholder="Enter a captivating title for your story..."
                  />
                </div>

                <div>
                  <label className="text-sm sm:text-base font-semibold text-base-content mb-2 sm:mb-3 flex items-center space-x-2">
                    <span className="text-lg sm:text-xl">📝</span>
                    <span>Story Description *</span>
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    value={storyData.description}
                    onChange={(e) => handleStoryDataChange('description', e.target.value)}
                    rows={5}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-base-200 border-2 border-base-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base-content placeholder-base-content/40 leading-relaxed resize-none text-sm sm:text-base touch-manipulation"
                    placeholder="Describe your story in a way that captivates readers..."
                  />
                  <p className="text-xs text-base-content/50 mt-2 ml-1">✨ Make it compelling and intriguing</p>
                </div>

                <div>
                  <label className="text-sm sm:text-base font-semibold text-base-content mb-2 sm:mb-3 flex items-center space-x-2">
                    <span className="text-lg sm:text-xl">🎨</span>
                    <span>Cover Image</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cover-upload"
                    />
                    <motion.label
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      htmlFor="cover-upload"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-base-200 text-base-content rounded-lg sm:rounded-xl hover:bg-base-300 cursor-pointer transition-all duration-300 border-2 border-base-300 hover:border-primary font-medium flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation min-h-11"
                    >
                      <span>📸</span>
                      <span>Choose Cover Image</span>
                    </motion.label>
                    {uploadingCover && (
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-primary">
                        <div className="animate-spin">⏳</div>
                        <span>Uploading...</span>
                      </div>
                    )}
                    {storyData.coverImage && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-3 bg-base-200 rounded-xl p-2 border border-primary/20 w-full sm:w-auto"
                      >
                        <img
                          src={storyData.coverImage}
                          alt="Cover preview"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-lg"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setStoryData(prev => ({ ...prev, coverImage: '' }))}
                          className="text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors touch-manipulation"
                        >
                          🗑️ Remove
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs text-base-content/50 mt-2 ml-1">📌 A great cover attracts more readers</p>
                </div>

                <div>
                  <label className="text-sm sm:text-base font-semibold text-base-content mb-2 sm:mb-3 flex items-center space-x-2">
                    <span className="text-lg sm:text-xl">🎭</span>
                    <span>Genres</span>
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {['Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Horror', 'Adventure', 'Drama', 'Comedy'].map(genre => (
                      <motion.button
                        key={genre}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation min-h-10 ${
                          storyData.genres.includes(genre)
                            ? 'bg-primary text-primary-content shadow-lg border-2 border-primary'
                            : 'bg-base-200 text-base-content hover:bg-base-300 border-2 border-base-300 hover:border-base-content/20'
                        }`}
                      >
                        {genre}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm sm:text-base font-semibold text-base-content mb-2 sm:mb-3 flex items-center space-x-2">
                    <span className="text-lg sm:text-xl">🏷️</span>
                    <span>Tags</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {storyData.tags.map(tag => (
                      <motion.span 
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center space-x-2 border border-primary/20"
                      >
                        <span>{tag}</span>
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTagRemove(tag)}
                          className="text-primary hover:text-primary-focus font-bold touch-manipulation"
                        >
                          ×
                        </motion.button>
                      </motion.span>
                    ))}
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleTagAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-base-200 border-2 border-base-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base-content placeholder-base-content/40 text-sm sm:text-base touch-manipulation"
                    placeholder="Add tags and press Enter..."
                  />
                  <p className="text-xs text-base-content/50 mt-2 ml-1">💡 Tags help readers discover your story</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:justify-end pt-4 sm:pt-6 gap-3">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(2)}
                disabled={!storyData.title || !storyData.description}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-primary-content rounded-xl sm:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-base sm:text-lg shadow-2xl flex items-center justify-center space-x-2 sm:space-x-3 touch-manipulation min-h-11"
              >
                <span>Next: Write Your Story</span>
                <span className="text-lg sm:text-xl">→</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Writer's Inspiration */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6 sm:mb-8 px-4"
            >
              <p className="text-lg sm:text-xl font-serif italic text-base-content/70 leading-relaxed">
                "Fill your paper with the breathings of your heart."
              </p>
              <p className="text-xs sm:text-sm text-base-content/60 mt-2">— William Wordsworth</p>
            </motion.div>

            {/* Chapter Navigation */}
            <div className="bg-base-100 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-base-300 shadow-xl mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                  {chapters.map((chapter, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentChapter(index)}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap touch-manipulation min-h-10 ${
                        currentChapter === index
                          ? 'bg-primary text-primary-content shadow-lg'
                          : 'bg-base-200 text-base-content/70 hover:bg-base-300 border border-base-300'
                      }`}
                    >
                      <span>📄</span>
                      <span>Chapter {index + 1}</span>
                      {chapter.content && (
                        <span className="ml-0.5 sm:ml-1 text-xs opacity-70 hidden sm:inline">
                          ({chapter.content.split(/\s+/).filter(w => w).length} words)
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addChapter}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-success text-success-content rounded-lg sm:rounded-xl hover:brightness-110 transition-all duration-300 font-semibold shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap text-xs sm:text-sm md:text-base touch-manipulation min-h-10"
                >
                  <span className="text-base sm:text-lg">+</span>
                  <span>New Chapter</span>
                </motion.button>
              </div>
            </div>

            {/* Current Chapter Editor */}
            <motion.div 
              key={currentChapter}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-base-100 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-base-300 shadow-xl mb-6 sm:mb-8">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Chapter Title */}
                <div>
                  <label className="flex items-center space-x-2 text-sm sm:text-base font-semibold text-base-content mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl">📖</span>
                    <span>Chapter Title</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={chapters[currentChapter]?.title || ''}
                    onChange={(e) => updateChapter(currentChapter, 'title', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-base-200 border-2 border-base-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base-content placeholder-base-content/40 text-base sm:text-lg font-serif touch-manipulation"
                    placeholder="Give this chapter a memorable title..."
                  />
                </div>

                {/* Word Count Display */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-2 bg-base-200 rounded-xl p-3">
                  <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-primary">
                      <span>📊</span>
                      <span className="font-semibold">
                        {chapters[currentChapter]?.content.split(/\s+/).filter(w => w).length || 0} words
                      </span>
                    </div>
                    <div className="h-4 w-px bg-base-300 hidden sm:block"></div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-base-content/60">
                      <span>🔤</span>
                      <span className="font-medium">{chapters[currentChapter]?.content.length || 0} characters</span>
                    </div>
                  </div>
                  <div className="text-xs text-base-content/50 w-full sm:w-auto text-left sm:text-right">
                    Last edited: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Chapter Content */}
                <div>
                  <label className="flex items-center space-x-2 text-sm sm:text-base font-semibold text-base-content mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl">✍️</span>
                    <span>Chapter Content</span>
                  </label>
                  <div className="relative">
                    <motion.textarea
                      whileFocus={{ scale: 1.005 }}
                      value={chapters[currentChapter]?.content || ''}
                      onChange={(e) => updateChapter(currentChapter, 'content', e.target.value)}
                      rows={window.innerWidth < 640 ? 16 : 24}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 bg-base-200 border-2 border-base-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-base-content placeholder-base-content/40 font-serif text-sm sm:text-base leading-loose resize-none shadow-inner touch-manipulation"
                      placeholder="Begin writing your story here... Let your imagination flow freely onto the page."
                      style={{
                        lineHeight: '1.8',
                        letterSpacing: '0.01em'
                      }}
                    />
                    {/* Decorative corner accents */}
                    <div className="absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-t-2 border-primary/20 rounded-tl-lg"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-t-2 border-primary/20 rounded-tr-lg"></div>
                    <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-l-2 border-b-2 border-primary/20 rounded-bl-lg"></div>
                    <div className="absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-b-2 border-primary/20 rounded-br-lg"></div>
                  </div>
                  <p className="text-xs text-base-content/50 mt-2 sm:mt-3 ml-1 italic">
                    💡 Write without judgment. You can always edit later.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 border-2 border-base-300 text-base-content/70 rounded-xl hover:bg-base-200 hover:border-primary transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation min-h-11"
              >
                <span className="text-lg">←</span>
                <span>Back to Details</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary hover:brightness-110 text-primary-content rounded-xl transition-all duration-300 font-bold shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation min-h-11"
              >
                <span>Review & Publish</span>
                <span className="text-lg">→</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Final Quote */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6 sm:mb-8 px-4"
            >
              <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-base-content/70 leading-relaxed">
                "A story is a letter that the author writes to himself, to tell himself things that he would be unable to think otherwise."
              </p>
              <p className="text-xs sm:text-sm text-base-content/60 mt-2">— Carlos Ruiz Zafón</p>
            </motion.div>

            <div className="bg-base-100 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-base-300 shadow-xl mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-base-content flex items-center space-x-2 sm:space-x-3">
                  <span className="text-2xl sm:text-3xl">🎯</span>
                  <span>Story Preview</span>
                </h3>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-success/10 border border-success rounded-lg sm:rounded-xl">
                  <span className="text-success font-semibold text-xs sm:text-sm">Ready to Publish! ✨</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {/* Story Details Column */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="bg-base-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-base-300">
                    <h4 className="font-semibold text-base-content mb-3 sm:mb-4 flex items-center space-x-2 text-base sm:text-lg">
                      <span>📚</span>
                      <span>Story Details</span>
                    </h4>
                    <div className="space-y-2.5 sm:space-y-3 text-base-content/70">
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-base-content/50 uppercase tracking-wider">Title</span>
                        <p className="text-base-content font-serif text-base sm:text-lg wrap-break-word">{storyData.title}</p>
                      </div>
                      <div className="h-px bg-base-300"></div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-base-content/50 uppercase tracking-wider">Description</span>
                        <p className="text-base-content/70 leading-relaxed text-sm sm:text-base wrap-break-word">{storyData.description}</p>
                      </div>
                      <div className="h-px bg-base-300"></div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-xs text-base-content/50 uppercase tracking-wider">Genres</span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {storyData.genres.map(genre => (
                            <span key={genre} className="px-2 sm:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm border border-primary/20">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="h-px bg-base-300"></div>
                      <div className="flex flex-col space-y-2">
                        <span className="text-xs text-base-content/50 uppercase tracking-wider">Tags</span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {storyData.tags.map(tag => (
                            <span key={tag} className="px-2 sm:px-3 py-1 bg-base-300 text-base-content/70 rounded-full text-xs border border-base-300">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="h-px bg-base-300"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-base-content/50 uppercase tracking-wider">Total Chapters</span>
                        <span className="text-xl sm:text-2xl font-bold text-primary">{chapters.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Word Count */}
                  <div className="bg-primary/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-primary mb-1">Total Word Count</p>
                        <p className="text-3xl sm:text-4xl font-bold text-primary">
                          {chapters.reduce((total, ch) => total + (ch.content.split(/\s+/).filter(w => w).length), 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-primary mt-1">words written</p>
                      </div>
                      <div className="text-4xl sm:text-5xl">📊</div>
                    </div>
                  </div>
                </motion.div>

                {/* Chapters Column */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-base-300 shadow-xl max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto">
                    <h4 className="font-semibold text-base-content mb-3 sm:mb-4 flex items-center space-x-2 text-base sm:text-lg sticky top-0 bg-base-100/95 backdrop-blur-sm pb-2">
                      <span>📖</span>
                      <span>Chapter Summary</span>
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {chapters.map((chapter, index) => {
                        const wordCount = chapter.content.split(/\s+/).filter(w => w).length;
                        return (
                          <motion.div 
                            key={index}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className="bg-base-200 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-300 hover:border-primary transition-all duration-300 cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                <span className="text-primary font-bold text-sm sm:text-base shrink-0">#{index + 1}</span>
                                <h5 className="font-medium text-base-content text-sm sm:text-base truncate">
                                  {chapter.title || 'Untitled Chapter'}
                                </h5>
                              </div>
                              {chapter.content.trim() && (
                                <span className="text-xs px-2 py-0.5 sm:py-1 bg-success/10 text-success rounded-full border border-success/20 whitespace-nowrap shrink-0">
                                  ✓ Ready
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-base-content/60">
                              <div className="flex items-center space-x-1">
                                <span>📝</span>
                                <span>{wordCount} words</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>🔤</span>
                                <span>{chapter.content.length} chars</span>
                              </div>
                            </div>
                            {wordCount < 100 && chapter.content.trim() && (
                              <p className="text-xs text-primary mt-2 flex items-center space-x-1">
                                <span>⚠️</span>
                                <span>Chapter might be too short</span>
                              </p>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Publishing Notes */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 sm:mt-6 bg-primary/10 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6"
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl shrink-0">💡</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-base-content mb-2 text-sm sm:text-base">Before You Publish</h5>
                    <ul className="text-xs sm:text-sm text-base-content/70 space-y-1">
                      <li>• Make sure all chapter titles are meaningful</li>
                      <li>• Review your story description for clarity</li>
                      <li>• Check that genres and tags accurately represent your story</li>
                      <li>• Ensure each chapter has substantial content</li>
                      <li>• Your story will be visible to all readers immediately</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 border-2 border-base-300 text-base-content/70 rounded-xl hover:bg-base-200 hover:border-primary transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation min-h-11"
              >
                <span className="text-lg">←</span>
                <span>Back to Writing</span>
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05
                }}
                whileTap={{ scale: 0.95 }}
                onClick={publishStory}
                disabled={loading}
                className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-primary text-primary-content rounded-xl sm:rounded-2xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-base sm:text-lg shadow-2xl flex items-center justify-center space-x-2 sm:space-x-3 relative overflow-hidden group touch-manipulation min-h-11"
              >
                <span className="relative z-10 flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xl sm:text-2xl">{loading ? '⏳' : '🚀'}</span>
                  <span className="hidden sm:inline">{loading ? 'Publishing Your Story...' : 'Publish to the World'}</span>
                  <span className="sm:hidden">{loading ? 'Publishing...' : 'Publish'}</span>
                </span>
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Write;