import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
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

  return (
    <nav className="bg-linear-to-r from-white via-amber-50/30 to-white backdrop-blur-sm bg-white/95 sticky top-0 z-50 border-b border-amber-100/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group transition-all duration-300 ease-in-out hover:scale-105">
            <div className="w-9 h-9 bg-linear-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-md group-hover:shadow-amber-300/50 transition-all duration-300">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">BookBee</span>
          </Link>

          {/* Navigation Links */}
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
              <div className="relative" ref={dropdownRef}>
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
                className="border-2 border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-700 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:shadow-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;