import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const StoryCard = ({ story, showEditButton = false, onEdit }) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const handleReadClick = async () => {
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
        scale: 1.05,
        y: -8
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer story-card group"
    >
      {/* Story Image */}
      <div className="relative overflow-hidden">
        <img 
          src={story.coverImage || 'https://picsum.photos/300/400?random=1'} 
          alt={story.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {story.rating} ★
        </div>
        {story.status && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium">
            {story.status}
          </div>
        )}
      </div>
      
      {/* Story Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {story.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">by {story.author?.name || 'Unknown Author'}</p>
        
        {/* Rating Stars */}
        <div className="flex items-center space-x-1">
          {renderStars(story.rating)}
          <span className="text-gray-500 text-sm ml-2">{story.rating}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleReadClick}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg font-medium transition-colors transform group-hover:scale-105"
          >
            Read Now
          </button>
          {showEditButton && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(story);
              }}
              className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;