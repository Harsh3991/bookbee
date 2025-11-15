import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative overflow-hidden bg-base-200 pt-20 pb-28">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl"
        />
        
        {/* Floating book/page elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, Math.random() * 10 - 5, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <div className="w-8 h-10 bg-primary/30 rounded-sm shadow-sm" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-flex items-center space-x-2 bg-base-100/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-primary/30">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                </span>
                <span className="text-sm font-semibold text-base-content">Join our growing community</span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-base-content leading-tight"
            >
              Read, Write & 
              <span className="block text-primary">
                Share Stories
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-xl"
            >
              Join thousands of readers and writers on BookBee. Discover captivating stories, 
              unleash your creativity, and connect with a vibrant community of storytellers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/search')}
                className="group relative px-8 py-4 bg-primary hover:bg-secondary text-primary-content rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Start Reading</span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(isAuthenticated ? '/write' : '/signup')}
                className="px-8 py-4 bg-base-100 hover:bg-base-200 text-base-content rounded-2xl font-bold text-lg shadow-lg border-2 border-base-300 hover:border-primary transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Write Story</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-4"
            >
              {[
                { value: '10K+', label: 'Stories' },
                { value: '50K+', label: 'Readers' },
                { value: '5K+', label: 'Writers' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-base-content/70 font-medium mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Elements - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Book Stack */}
            <div className="relative">
              {/* Book 1 - Top with Random Image */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotateZ: [2, 4, 2]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-30 bg-base-100 p-6 rounded-2xl shadow-2xl shadow-primary/20 border border-primary/20 transform rotate-2"
              >
                <div className="w-64 h-80 bg-primary rounded-xl overflow-hidden shadow-inner relative">
                  <img 
                    src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop" 
                    alt="Book Cover"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-6">
                    <div className="text-center space-y-2">
                      <div className="text-white font-bold text-xl drop-shadow-lg">Your Next</div>
                      <div className="text-white font-bold text-2xl drop-shadow-lg">Adventure</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Book 2 - Middle with Random Image */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotateZ: [-1, -2, -1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute top-8 -left-6 z-20 bg-base-100 p-6 rounded-2xl shadow-xl shadow-secondary/20 border border-secondary/20 transform -rotate-3"
              >
                <div className="w-56 h-72 bg-secondary rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=350&h=450&fit=crop" 
                    alt="Book Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Book 3 - Bottom with Random Image */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  rotateZ: [1, 2, 1]
                }}
                transition={{ 
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-16 -right-6 z-10 bg-base-100 p-6 rounded-2xl shadow-xl shadow-accent/20 border border-accent/20 transform rotate-6"
              >
                <div className="w-48 h-64 bg-accent rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop" 
                    alt="Book Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* Floating Decorative Elements */}
            <motion.div 
              animate={{ 
                y: [0, -25, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-8 -left-8 w-16 h-16 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.div>

            <motion.div 
              animate={{ 
                y: [0, -30, 0],
                x: [0, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-8 -right-8 w-20 h-20 bg-secondary rounded-2xl shadow-lg shadow-secondary/40 transform rotate-12"
            />

            {/* Small floating dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20 - Math.random() * 10, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                className="absolute w-3 h-3 bg-primary rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;