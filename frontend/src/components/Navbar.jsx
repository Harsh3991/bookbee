import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, availableThemes } from '../contexts/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileThemeOpen, setIsMobileThemeOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const themeDropdownRef = useRef(null);

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

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };

    if (isThemeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeDropdownOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      setIsThemeDropdownOpen(false);
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
      <nav className="bg-base-100/95 backdrop-blur-sm sticky top-0 z-50 border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Center on Mobile (using absolute positioning), Left on Desktop */}
          <Link to="/" className="flex items-center space-x-2 group transition-all duration-300 ease-in-out hover:scale-105 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-md group-hover:shadow-primary/50 transition-all duration-300">
              <span className="text-primary-content font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-primary">BookBee</span>
          </Link>

          {/* Navigation Links - Desktop Only */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-base-content font-medium hover:text-primary transition-all duration-300 ease-in-out hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">
              Home
            </Link>
            <button 
              onClick={() => navigate('/search')}
              className="text-base-content font-medium hover:text-primary transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
            >
              Search
            </button>
            {isAuthenticated ? (
              <Link to="/write" className="text-base-content font-medium hover:text-primary transition-all duration-300 ease-in-out hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300">
                Write
              </Link>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-base-content font-medium hover:text-primary transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
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
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-primary hover:bg-secondary transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-md hover:shadow-lg hover:shadow-primary/40 hover:scale-105"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name || 'User'}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-base-100"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-primary-content"
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
                    className="absolute right-0 mt-3 w-56 bg-base-100 backdrop-blur-md rounded-2xl shadow-xl py-2 z-50 border border-base-300 animate-fadeIn"
                    role="menu"
                    aria-orientation="vertical"
                    style={{
                      animation: 'fadeIn 0.2s ease-out',
                    }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-base-300 bg-base-200">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name || 'User'}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
                              <span className="text-primary-content font-bold text-lg">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-base-content truncate">
                            {user?.name || 'User'}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-base-content/60 truncate">{user.email}</p>
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
                        className="w-full text-left px-4 py-2.5 text-sm text-base-content hover:bg-base-200 hover:text-primary transition-all duration-300 ease-in-out flex items-center space-x-3 group"
                        role="menuitem"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200 group-hover:bg-primary/20 transition-all duration-300">
                          <svg
                            className="w-5 h-5 text-base-content group-hover:text-primary transition-colors duration-300"
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
                        className="w-full text-left px-4 py-2.5 text-sm text-base-content hover:bg-error/10 hover:text-error transition-all duration-300 ease-in-out flex items-center space-x-3 group"
                        role="menuitem"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-base-200 group-hover:bg-error/20 transition-all duration-300">
                          <svg
                            className="w-5 h-5 text-base-content group-hover:text-error transition-colors duration-300"
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
                className="hidden md:flex border-2 border-primary text-primary hover:bg-primary/10 hover:border-secondary hover:text-secondary px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Login
              </Link>
            )}

            {/* Theme Selector - Desktop */}
            <div className="hidden md:block relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200/80 hover:bg-base-200 border border-base-300 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Select theme"
                aria-expanded={isThemeDropdownOpen}
              >
                <span className="text-xl" role="img" aria-label="Current theme">
                  {theme === 'light' && '☀️'}
                  {theme === 'dark' && '🌙'}
                  {theme === 'cupcake' && '🧁'}
                  {theme === 'bumblebee' && '🐝'}
                  {theme === 'emerald' && '💚'}
                  {theme === 'corporate' && '💼'}
                  {theme === 'synthwave' && '🌆'}
                  {theme === 'retro' && '📻'}
                  {theme === 'cyberpunk' && '🤖'}
                  {theme === 'valentine' && '💝'}
                  {theme === 'halloween' && '🎃'}
                  {theme === 'garden' && '🌸'}
                  {theme === 'forest' && '🌲'}
                  {theme === 'aqua' && '💧'}
                  {theme === 'lofi' && '🎧'}
                  {theme === 'pastel' && '🎨'}
                  {theme === 'fantasy' && '🦄'}
                  {theme === 'wireframe' && '📐'}
                  {theme === 'black' && '⬛'}
                  {theme === 'luxury' && '💎'}
                  {theme === 'dracula' && '🧛'}
                  {theme === 'cmyk' && '🖨️'}
                  {theme === 'autumn' && '🍂'}
                  {theme === 'business' && '📊'}
                  {theme === 'acid' && '🧪'}
                  {theme === 'lemonade' && '🍋'}
                  {theme === 'night' && '🌃'}
                  {theme === 'coffee' && '☕'}
                  {theme === 'winter' && '❄️'}
                  {theme === 'dim' && '🔅'}
                  {theme === 'nord' && '🏔️'}
                  {theme === 'sunset' && '🌅'}
                  {theme === 'caramellatte' && '🥛'}
                  {theme === 'abyss' && '🌊'}
                  {theme === 'silk' && '✨'}
                </span>
              </button>

              {/* Theme Dropdown */}
              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-base-100 backdrop-blur-md rounded-2xl shadow-xl border border-base-300 z-50 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-1 p-2">
                    {availableThemes.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTheme(t);
                          setIsThemeDropdownOpen(false);
                        }}
                        className={`flex items-center justify-center w-full aspect-square rounded-lg transition-all duration-200 hover:bg-base-200 hover:scale-110 ${
                          theme === t ? 'bg-primary/20 ring-2 ring-primary' : 'bg-base-200/50'
                        }`}
                        title={t.charAt(0).toUpperCase() + t.slice(1)}
                      >
                        <span className="text-xl" role="img">
                          {t === 'light' && '☀️'}
                          {t === 'dark' && '🌙'}
                          {t === 'cupcake' && '🧁'}
                          {t === 'bumblebee' && '🐝'}
                          {t === 'emerald' && '💚'}
                          {t === 'corporate' && '💼'}
                          {t === 'synthwave' && '🌆'}
                          {t === 'retro' && '📻'}
                          {t === 'cyberpunk' && '🤖'}
                          {t === 'valentine' && '💝'}
                          {t === 'halloween' && '🎃'}
                          {t === 'garden' && '🌸'}
                          {t === 'forest' && '🌲'}
                          {t === 'aqua' && '💧'}
                          {t === 'lofi' && '🎧'}
                          {t === 'pastel' && '🎨'}
                          {t === 'fantasy' && '🦄'}
                          {t === 'wireframe' && '📐'}
                          {t === 'black' && '⬛'}
                          {t === 'luxury' && '💎'}
                          {t === 'dracula' && '🧛'}
                          {t === 'cmyk' && '🖨️'}
                          {t === 'autumn' && '🍂'}
                          {t === 'business' && '📊'}
                          {t === 'acid' && '🧪'}
                          {t === 'lemonade' && '🍋'}
                          {t === 'night' && '🌃'}
                          {t === 'coffee' && '☕'}
                          {t === 'winter' && '❄️'}
                          {t === 'dim' && '🔅'}
                          {t === 'nord' && '🏔️'}
                          {t === 'sunset' && '🌅'}
                          {t === 'caramellatte' && '🥛'}
                          {t === 'abyss' && '🌊'}
                          {t === 'silk' && '✨'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Right Side */}
            <button
              onClick={handleMobileMenuToggle}
              onKeyDown={handleKeyDown}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-base-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ml-3"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-0.5 bg-primary rounded-full origin-center"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="w-full h-0.5 bg-primary rounded-full"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full h-0.5 bg-primary rounded-full origin-center"
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
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-base-100 backdrop-blur-xl shadow-2xl md:hidden overflow-y-auto"
              style={{ zIndex: 99999 }}
              onKeyDown={handleKeyDown}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-base-300 bg-base-200">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <span className="text-primary-content font-bold text-lg">B</span>
                  </div>
                  <span className="text-xl font-bold text-primary">BookBee</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-base-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-base-content hover:bg-base-200 hover:text-primary transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 group-hover:bg-primary/20 transition-all duration-300">
                      <svg className="w-6 h-6 text-base-content group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-base font-semibold">Home</span>
                  </button>

                  {/* Search */}
                  <button
                    onClick={() => handleMobileMenuItemClick('/search')}
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-base-content hover:bg-base-200 hover:text-primary transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 group-hover:bg-primary/20 transition-all duration-300">
                      <svg className="w-6 h-6 text-base-content group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-base font-semibold">Search</span>
                  </button>

                  {/* Write */}
                  <button
                    onClick={() => handleMobileMenuItemClick(isAuthenticated ? '/write' : '/login')}
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-base-content hover:bg-base-200 hover:text-primary transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 group-hover:bg-primary/20 transition-all duration-300">
                      <svg className="w-6 h-6 text-base-content group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <span className="text-base font-semibold">Write</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-4 mx-4 border-t border-base-300"></div>

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="px-4 space-y-2">
                    {/* User Info */}
                    <div className="px-4 py-3 mb-2 rounded-xl bg-base-200">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name || 'User'}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-sm">
                              <span className="text-primary-content font-bold text-xl">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-base-content truncate">
                            {user?.name || 'User'}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile */}
                    <button
                      onClick={() => handleMobileMenuItemClick('/profile')}
                      className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-base-content hover:bg-base-200 hover:text-primary transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 group-hover:bg-primary/20 transition-all duration-300">
                        <svg className="w-6 h-6 text-base-content group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-base font-semibold">My Profile</span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleMobileLogout}
                      className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-base-content hover:bg-error/10 hover:text-error transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 group-hover:bg-error/20 transition-all duration-300">
                        <svg className="w-6 h-6 text-base-content group-hover:text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-primary hover:bg-secondary text-primary-content font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </button>
                  </div>
                )}

                {/* Divider */}
                <div className="my-4 mx-4 border-t border-base-300"></div>

                {/* Theme Selector - Mobile */}
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setIsMobileThemeOpen(!isMobileThemeOpen)}
                    className="w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-base-content hover:bg-base-200 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-base-200 group-hover:bg-primary/20 transition-all duration-300">
                      <span className="text-2xl" role="img" aria-label="Current theme">
                        {theme === 'light' && '☀️'}
                        {theme === 'dark' && '🌙'}
                        {theme === 'cupcake' && '🧁'}
                        {theme === 'bumblebee' && '🐝'}
                        {theme === 'emerald' && '💚'}
                        {theme === 'corporate' && '💼'}
                        {theme === 'synthwave' && '🌆'}
                        {theme === 'retro' && '📻'}
                        {theme === 'cyberpunk' && '🤖'}
                        {theme === 'valentine' && '💝'}
                        {theme === 'halloween' && '🎃'}
                        {theme === 'garden' && '🌸'}
                        {theme === 'forest' && '🌲'}
                        {theme === 'aqua' && '💧'}
                        {theme === 'lofi' && '🎧'}
                        {theme === 'pastel' && '🎨'}
                        {theme === 'fantasy' && '🦄'}
                        {theme === 'wireframe' && '📐'}
                        {theme === 'black' && '⬛'}
                        {theme === 'luxury' && '💎'}
                        {theme === 'dracula' && '🧛'}
                        {theme === 'cmyk' && '🖨️'}
                        {theme === 'autumn' && '🍂'}
                        {theme === 'business' && '📊'}
                        {theme === 'acid' && '🧪'}
                        {theme === 'lemonade' && '🍋'}
                        {theme === 'night' && '🌃'}
                        {theme === 'coffee' && '☕'}
                        {theme === 'winter' && '❄️'}
                        {theme === 'dim' && '🔅'}
                        {theme === 'nord' && '🏔️'}
                        {theme === 'sunset' && '🌅'}
                        {theme === 'caramellatte' && '🥛'}
                        {theme === 'abyss' && '🌊'}
                        {theme === 'silk' && '✨'}
                      </span>
                    </div>
                    <span className="text-base font-semibold flex-1 text-left">Theme</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isMobileThemeOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Theme Dropdown */}
                  <AnimatePresence>
                    {isMobileThemeOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pt-2 pb-4">
                          <div className="grid grid-cols-7 gap-2 p-3 rounded-xl bg-base-200">
                            {availableThemes.map((t) => (
                              <button
                                key={t}
                                onClick={() => {
                                  setTheme(t);
                                  setIsMobileThemeOpen(false);
                                }}
                                className={`flex items-center justify-center aspect-square rounded-lg transition-all duration-200 hover:scale-110 ${
                                  theme === t ? 'bg-primary/20 ring-2 ring-primary' : 'bg-base-100 hover:bg-base-300'
                                }`}
                                title={t.charAt(0).toUpperCase() + t.slice(1)}
                              >
                                <span className="text-xl" role="img">
                                  {t === 'light' && '☀️'}
                                  {t === 'dark' && '🌙'}
                                  {t === 'cupcake' && '🧁'}
                                  {t === 'bumblebee' && '🐝'}
                                  {t === 'emerald' && '💚'}
                                  {t === 'corporate' && '💼'}
                                  {t === 'synthwave' && '🌆'}
                                  {t === 'retro' && '📻'}
                                  {t === 'cyberpunk' && '🤖'}
                                  {t === 'valentine' && '💝'}
                                  {t === 'halloween' && '🎃'}
                                  {t === 'garden' && '🌸'}
                                  {t === 'forest' && '🌲'}
                                  {t === 'aqua' && '💧'}
                                  {t === 'lofi' && '🎧'}
                                  {t === 'pastel' && '🎨'}
                                  {t === 'fantasy' && '🦄'}
                                  {t === 'wireframe' && '📐'}
                                  {t === 'black' && '⬛'}
                                  {t === 'luxury' && '💎'}
                                  {t === 'dracula' && '🧛'}
                                  {t === 'cmyk' && '🖨️'}
                                  {t === 'autumn' && '🍂'}
                                  {t === 'business' && '📊'}
                                  {t === 'acid' && '🧪'}
                                  {t === 'lemonade' && '🍋'}
                                  {t === 'night' && '🌃'}
                                  {t === 'coffee' && '☕'}
                                  {t === 'winter' && '❄️'}
                                  {t === 'dim' && '🔅'}
                                  {t === 'nord' && '🏔️'}
                                  {t === 'sunset' && '🌅'}
                                  {t === 'caramellatte' && '🥛'}
                                  {t === 'abyss' && '🌊'}
                                  {t === 'silk' && '✨'}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;