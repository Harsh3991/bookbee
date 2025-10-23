import { motion } from 'framer-motion';

const StoryCard = ({ story }) => {
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
          src={story.image} 
          alt={story.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {story.rating} ★
        </div>
      </div>
      
      {/* Story Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {story.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">by {story.author}</p>
        
        {/* Rating Stars */}
        <div className="flex items-center space-x-1">
          {renderStars(story.rating)}
          <span className="text-gray-500 text-sm ml-2">{story.rating}</span>
        </div>
        
        {/* Read Button */}
        <button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-lg font-medium transition-colors transform group-hover:scale-105">
          Read Now
        </button>
      </div>
    </motion.div>
  );
};

export default StoryCard;