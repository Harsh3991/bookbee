import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(formData);

      // Update auth context (this will handle localStorage)
      login(response);

      // Check for redirect parameter
      const redirectPath = searchParams.get('redirect');
      
      // Redirect to the intended page or home
      navigate(redirectPath || '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Floating background elements
  const FloatingElement = ({ delay, duration, x, y }) => (
    <motion.div
      className="absolute rounded-full bg-primary opacity-20"
      style={{
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );

  // Bee icon animation
  const BeeIcon = () => (
    <motion.div
      className="absolute -top-16 -right-16 text-primary opacity-30"
      animate={{
        rotate: [0, 10, -10, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C10.9 2 10 2.9 10 4C10 4.4 10.1 4.7 10.3 5C9.5 5.3 8.9 6.1 8.9 7C8.9 7.5 9.1 8 9.4 8.4C8.6 8.9 8 9.7 8 10.7C8 11.4 8.3 12 8.7 12.5C8.3 13 8 13.6 8 14.3C8 15.5 8.8 16.5 10 16.9V19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19V16.9C15.2 16.5 16 15.5 16 14.3C16 13.6 15.7 13 15.3 12.5C15.7 12 16 11.4 16 10.7C16 9.7 15.4 8.9 14.6 8.4C14.9 8 15.1 7.5 15.1 7C15.1 6.1 14.5 5.3 13.7 5C13.9 4.7 14 4.4 14 4C14 2.9 13.1 2 12 2Z"/>
      </svg>
    </motion.div>
  );

  // Book icon animation
  const BookIcon = () => (
    <motion.div
      className="absolute -bottom-16 -left-16 text-primary opacity-30"
      animate={{
        rotate: [0, -10, 10, 0],
        x: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20ZM7 10H17V12H7V10ZM7 14H17V16H7V14ZM7 6H17V8H7V6Z"/>
      </svg>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 relative overflow-hidden">
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
      </div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}/>
      </div>

      {/* Floating Elements */}
      <FloatingElement delay={0} duration={6} x={10} y={20} />
      <FloatingElement delay={1} duration={8} x={80} y={70} />
      <FloatingElement delay={2} duration={7} x={15} y={80} />
      <FloatingElement delay={1.5} duration={9} x={85} y={15} />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Glass Morphism Container */}
        <motion.div
          className="bg-base-100/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-base-300/20 relative overflow-hidden"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(251, 191, 36, 0.25)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative Icons */}
          <BeeIcon />
          <BookIcon />

          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="flex items-center justify-center space-x-2 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(251, 191, 36, 0.4)",
                    "0 0 0 10px rgba(251, 191, 36, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <span className="text-primary-content font-bold text-2xl">B</span>
              </motion.div>
              <span className="text-3xl font-bold text-base-content">
                BookBee
              </span>
            </motion.div>
            <motion.h2
              className="text-4xl font-bold text-base-content mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Welcome back
            </motion.h2>
            <motion.p
              className="text-base-content/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to continue your reading journey
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message with Animation */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-base-content mb-2">
                Email address
              </label>
              <motion.div
                className="relative"
                animate={focusedField === 'email' ? {
                  scale: 1.02,
                } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className={`relative block w-full px-4 py-3 pl-12 border ${
                    focusedField === 'email'
                      ? 'border-primary ring-2 ring-primary ring-opacity-50'
                      : 'border-base-300'
                  } placeholder-base-content/40 text-base-content rounded-xl focus:outline-none transition-all duration-200 bg-base-100/50 backdrop-blur-sm`}
                  placeholder="your@email.com"
                />
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                  animate={focusedField === 'email' ? { scale: 1.2, color: 'oklch(var(--p))' } : {}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-base-content mb-2">
                Password
              </label>
              <motion.div
                className="relative"
                animate={focusedField === 'password' ? {
                  scale: 1.02,
                } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`relative block w-full px-4 py-3 pl-12 pr-12 border ${
                    focusedField === 'password'
                      ? 'border-primary ring-2 ring-primary ring-opacity-50'
                      : 'border-base-300'
                  } placeholder-base-content/40 text-base-content rounded-xl focus:outline-none transition-all duration-200 bg-base-100/50 backdrop-blur-sm`}
                  placeholder="••••••••"
                />
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50"
                  animate={focusedField === 'password' ? { scale: 1.2, color: 'oklch(var(--p))' } : {}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div className="flex items-center">
                <motion.input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-base-content cursor-pointer">
                  Remember me
                </label>
              </motion.div>

              <div className="text-sm">
                <motion.a
                  href="#"
                  className="font-medium text-primary hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Forgot password?
                </motion.a>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-primary-content bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {/* Button Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-secondary/30"
                  animate={loading ? {
                    x: ['-100%', '100%'],
                  } : {}}
                  transition={{
                    duration: 1.5,
                    repeat: loading ? Infinity : 0,
                    ease: "linear",
                  }}
                />
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <motion.svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-content"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </motion.svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <motion.svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-base-100/90 text-base-content/60">Or continue with</span>
              </div>
            </motion.div>

            {/* Social Login */}
            <motion.div
              className="grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {['Google', 'Facebook', 'Apple'].map((provider, index) => (
                <motion.button
                  key={provider}
                  type="button"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-base-300 rounded-xl shadow-sm bg-base-100/50 backdrop-blur-sm text-sm font-medium text-base-content/60 hover:bg-base-200 transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {provider === 'Google' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                      <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                      <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                      <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                    </svg>
                  )}
                  {provider === 'Facebook' && (
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  {provider === 'Apple' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <span className="text-base-content/70">Don't have an account? </span>
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-secondary transition-colors"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  Sign up
                </motion.span>
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;