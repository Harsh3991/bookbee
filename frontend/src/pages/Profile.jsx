import { motion } from 'framer-motion';
import StoryCard from '../components/StoryCard';
import storiesData from '../data/stories.json';

const Profile = () => {
  // For demo, using first 4 stories as user's stories
  const userStories = storiesData.stories.slice(0, 4);

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
              JD
            </motion.div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
              <p className="text-gray-600 mb-4">Avid reader and aspiring writer. Love fantasy and romance stories.</p>
              <div className="flex space-x-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">24</div>
                  <div className="text-gray-500">Stories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">1.2K</div>
                  <div className="text-gray-500">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">356</div>
                  <div className="text-gray-500">Following</div>
                </div>
              </div>
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* User's Stories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;