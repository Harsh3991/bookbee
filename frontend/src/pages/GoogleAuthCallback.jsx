import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { motion } from 'framer-motion';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Parse the URL query parameters
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        // If there's an error, redirect to login with error message
        navigate('/login?error=authentication_failed');
        return;
      }

      if (token) {
        try {
          // Store token temporarily to make API calls
          localStorage.setItem('token', token);

          // Fetch full user profile from backend
          const userData = await api.getProfile();

          // Create complete user object with token
          const completeUserData = {
            ...userData,
            token,
          };

          // Store token and user data via login function
          login(completeUserData);

          // Redirect to home/dashboard
          navigate('/');
        } catch (err) {
          console.error('Error fetching user profile:', err);
          localStorage.removeItem('token');
          navigate('/login?error=authentication_failed');
        }
      } else {
        // No token found, redirect to login
        navigate('/login?error=no_token');
      }
    };

    handleGoogleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Loading Spinner */}
        <motion.div
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Loading Text */}
        <motion.h2
          className="text-2xl font-bold text-base-content mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Signing you in...
        </motion.h2>
        
        <motion.p
          className="text-base-content/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Please wait while we complete your authentication
        </motion.p>

        {/* BookBee Logo Animation */}
        <motion.div
          className="mt-8 flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(251, 191, 36, 0.4)",
                "0 0 0 15px rgba(251, 191, 36, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <span className="text-primary-content font-bold text-xl">B</span>
          </motion.div>
          <span className="text-2xl font-bold text-base-content">BookBee</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GoogleAuthCallback;
