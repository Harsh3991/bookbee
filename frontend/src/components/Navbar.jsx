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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-800">BookBee</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <button 
              onClick={() => navigate('/search')}
              className="text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer"
            >
              Search
            </button>
            <Link to="/write" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Write
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onKeyDown={handleKeyDown}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-6 h-6 text-black"
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
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 animate-fadeIn"
                    role="menu"
                    aria-orientation="vertical"
                    style={{
                      animation: 'fadeIn 0.2s ease-out',
                    }}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-yellow-50 to-white">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name || 'User'}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                              <span className="text-black font-bold text-lg">
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
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 flex items-center space-x-3 group"
                        role="menuitem"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-yellow-100 transition-colors">
                          <svg
                            className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors"
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
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center space-x-3 group"
                        role="menuitem"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                          <svg
                            className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors"
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
              <div className="flex space-x-3">
                <Link 
                  to="/login"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;