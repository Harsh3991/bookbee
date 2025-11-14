import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuItemClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleMobileLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <>
      <nav className="bg-linear-to-r from-white via-amber-50/30 to-white backdrop-blur-sm bg-white/95 sticky top-0 z-50 border-b border-amber-100/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Center on Mobile (using absolute positioning), Left on Desktop */}
          <Link to="/" className="flex items-center space-x-2 group transition-all duration-300 ease-in-out hover:scale-105 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <div className="w-9 h-9 bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-md group-hover:shadow-amber-300/50 transition-all duration-300">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">BookBee</span>
          </Link>

          {/* Navigation Links - Desktop Only */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 font-medium hover:text-amber-500 transition-all duration-300 ease-in-out hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-linear-to-r after:from-amber-400 after:to-orange-400 after:transition-all after:duration-300">
              Home
            </Link>
            <button 
              onClick={() => navigate('/search')}
              className="text-gray-700 font-medium hover:text-amber-500 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-linear-to-r after:from-amber-400 after:to-orange-400 after:transition-all after:duration-300"
            >
              Search
            </button>
            {isAuthenticated ? (
              <Link to="/write" className="text-gray-700 font-medium hover:text-amber-500 transition-all duration-300 ease-in-out hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-linear-to-r after:from-amber-400 after:to-orange-400 after:transition-all after:duration-300">
                Write
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 font-medium hover:text-amber-500 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-linear-to-r after:from-amber-400 after:to-orange-400 after:transition-all after:duration-300"
              >
                Write
              </button>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onKeyDown={handleKeyDown}
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 hover:from-amber-500 hover:via-orange-500 hover:to-yellow-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 shadow-md hover:shadow-lg hover:shadow-amber-300/40 hover:scale-105"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name || 'User'}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-linear-to-b from-white to-amber-50/30 backdrop-blur-md rounded-2xl shadow-xl py-2 z-50 border border-amber-100/50 animate-fadeIn"
                    role="menu"
                    aria-orientation="vertical"
                    style={{
                      animation: 'fadeIn 0.2s ease-out',
                    }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-amber-100/50 bg-linear-to-r from-amber-50/50 to-orange-50/30">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name || 'User'}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-lg">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.name || 'User'}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="py-1">
                      {/* Profile Option */}
                      <button
                        onClick={handleProfileClick}
                        onKeyDown={(e) => e.key === 'Enter' && handleProfileClick()}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 ease-in-out flex items-center space-x-3 group"
                        role="menuitem"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-linear-to-r group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300">
                          <svg
                            className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">My Profile</span>
                      </button>

                      {/* Logout Option */}
                      <button
                        onClick={handleLogout}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out flex items-center space-x-3 group"
                        role="menuitem"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-linear-to-r group-hover:from-red-100 group-hover:to-red-100 transition-all duration-300">
                          <svg
                            className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden md:flex border-2 border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-700 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:shadow-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button - Right Side */}
            <button
              onClick={handleMobileMenuToggle}
              onKeyDown={handleKeyDown}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-amber-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ml-3"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-0.5 bg-amber-600 rounded-full origin-center"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="w-full h-0.5 bg-amber-600 rounded-full"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-0.5 bg-amber-600 rounded-full origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Overlay - Outside nav for proper z-index layering */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
              style={{ zIndex: 99998 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-linear-to-br from-white via-amber-50/50 to-orange-50/30 backdrop-blur-xl shadow-2xl md:hidden overflow-y-auto"
              style={{ zIndex: 99999 }}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-amber-100/50 bg-linear-to-r from-amber-50/50 to-orange-50/30">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <span className="text-xl font-bold bg-linear-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">BookBee</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-amber-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <div className="py-4">
                {/* Navigation Links */}
                <div className="px-4 space-y-2">
                  {/* Home */}
                  <button
                    onClick={() => handleMobileMenuItemClick('/')}
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-linear-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-linear-to-r group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300">
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-base font-semibold">Home</span>
                  </button>

                  {/* Search */}
                  <button
                    onClick={() => handleMobileMenuItemClick('/search')}
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-linear-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-linear-to-r group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300">
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-base font-semibold">Search</span>
                  </button>

                  {/* Write */}
                  <button
                    onClick={() => handleMobileMenuItemClick(isAuthenticated ? '/write' : '/login')}
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-linear-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-linear-to-r group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300">
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <span className="text-base font-semibold">Write</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-4 mx-4 border-t border-amber-100/50"></div>

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="px-4 space-y-2">
                    {/* User Info */}
                    <div className="px-4 py-3 mb-2 rounded-xl bg-linear-to-r from-amber-50/50 to-orange-50/30">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name || 'User'}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-xl">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.name || 'User'}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile */}
                    <button
                      onClick={() => handleMobileMenuItemClick('/profile')}
                      className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-linear-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-linear-to-r group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-300">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-base font-semibold">My Profile</span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleMobileLogout}
                      className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-gray-700 hover:bg-linear-to-r hover:from-red-50 hover:to-red-50 hover:text-red-600 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-linear-to-r group-hover:from-red-100 group-hover:to-red-100 transition-all duration-300">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span className="text-base font-semibold">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="px-4">
                    {/* Login Button */}
                    <button
                      onClick={() => handleMobileMenuItemClick('/login')}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 hover:from-amber-500 hover:via-orange-500 hover:to-yellow-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;