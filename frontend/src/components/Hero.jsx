import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="bg-linear-to-br from-yellow-400 via-yellow-300 to-orange-200 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Read, Write & 
              <span className="text-white"> Share</span>
              <br />
              Your Stories
            </h1>
            <p className="text-xl text-gray-700">
              Join millions of readers and writers on BookBee. Discover amazing stories, 
              share your creativity, and connect with a community of book lovers.
            </p>
            <div className="flex space-x-4">
              <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors transform hover:scale-105">
                Start Reading
              </button>
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105">
                Write Story
              </button>
            </div>
          </motion.div>

          {/* Animated Elements */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-white p-6 rounded-2xl shadow-2xl"
            >
              <div className="w-64 h-80 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-semibold">Book Cover</span>
              </div>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ 
                y: [0, -30, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -top-4 -left-4 bg-yellow-500 w-12 h-12 rounded-full shadow-lg"
            />
            <motion.div 
              animate={{ 
                y: [0, -40, 0],
                x: [0, -15, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-6 -right-6 bg-black w-16 h-16 rounded-full shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;