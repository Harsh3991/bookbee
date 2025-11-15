import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const StoryCard = ({ story, showEditButton = false, onEdit }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`text-lg ${index < Math.floor(rating) ? 'text-primary' : 'text-base-content/20'}`}
      >
        ★
      </motion.span>
    ));
  };

  const handleReadClick = async () => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      try {
        // Fetch chapters to get the first chapter ID
        const chapters = await api.getChapters(story._id);
        if (chapters.length > 0) {
          navigate(`/login?redirect=/read/${story._id}/${chapters[0]._id}`);
        } else {
          navigate(`/login?redirect=/read/${story._id}/first`);
        }
      } catch (error) {
        // If fetching chapters fails, redirect to login anyway
        navigate(`/login?redirect=/read/${story._id}/first`);
      }
      return;
    }

    // If authenticated, proceed as normal
    try {
      // Fetch chapters for this story
      const chapters = await api.getChapters(story._id);
      if (chapters.length > 0) {
        // Navigate to the first chapter
        navigate(`/read/${story._id}/${chapters[0]._id}`);
      } else {
        // No chapters available
        console.log('No chapters available for this story');
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -12,
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="bg-base-100 rounded-2xl shadow-lg shadow-base-300/50 overflow-hidden cursor-pointer story-card group border border-base-300 hover:shadow-2xl hover:shadow-primary/10 transition-all"
    >
      {/* Story Image */}
      <div className="relative overflow-hidden h-56">
        <motion.img 
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          src={story.coverImage || 'https://picsum.photos/300/400?random=1'} 
          alt={story.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Rating Badge */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg"
        >
          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{story.rating}</span>
        </motion.div>
        
        {/* Status Badge */}
        {story.status && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-3 left-3 bg-primary text-primary-content px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
          >
            {story.status}
          </motion.div>
        )}
      </div>
      
      {/* Story Info */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight min-h-11.25">
          {story.title}
        </h3>
        <p className="text-base-content/70 text-sm mb-3 flex items-center space-x-1.5">
          <svg className="w-4 h-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>by {story.author?.name || 'Unknown Author'}</span>
        </p>
        
        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-4">
          {renderStars(story.rating)}
          <span className="text-base-content/60 text-sm ml-2 font-medium">({story.rating})</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReadClick}
            className="flex-1 bg-primary hover:bg-secondary text-primary-content py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Read Now</span>
          </motion.button>
          {showEditButton && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(story);
              }}
              className="px-4 bg-base-100 hover:bg-base-200 text-base-content py-2.5 rounded-xl font-bold transition-all border-2 border-base-300 hover:border-primary shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;