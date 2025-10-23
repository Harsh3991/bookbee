import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import StoryCard from '../components/StoryCard';
import storiesData from '../data/stories.json';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      {/* Stories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular and trending stories from our community of writers
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {storiesData.stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;