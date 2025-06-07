import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, BookOpen, LogOut, AlertCircle, User, ChevronDown, Settings, Bell } from 'lucide-react';
import UserProfile from './UserProfile';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentDay, streak } = useTaskContext();
  const { signOut, isDemoMode, user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.display_name) {
      return user.user_metadata.display_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4 py-4">
          {isDemoMode && (
            <div className="mb-4 bg-amber-100 dark:bg-amber-900 border border-amber-400 text-amber-700 dark:text-amber-200 px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  <strong>Demo Mode:</strong> This is a preview version. To enable full functionality, configure Supabase.
                </span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">PrepBuddy</h1>
                <span className="text-sm text-gray-600 dark:text-gray-400">by Mani</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex space-x-6">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Day:</span>
                  <span className="text-lg font-bold bg-indigo-600 text-white dark:bg-indigo-700 px-2 py-1 rounded">
                    {currentDay}/100
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Streak:</span>
                  <span className="text-lg font-bold bg-amber-500 text-white dark:bg-amber-600 px-2 py-1 rounded">
                    {streak} days
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {user?.email ? getInitials(user.email) : 'U'}
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          {user?.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                              {user?.email ? getInitials(user.email) : 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="h-4 w-4 mr-3" />
                          View Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Bell className="h-4 w-4 mr-3" />
                          Notifications
                        </button>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        
                        <button
                          onClick={() => {
                            signOut();
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:hidden flex justify-center space-x-6 mt-3">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Day:</span>
              <span className="text-lg font-bold bg-indigo-600 text-white dark:bg-indigo-700 px-2 py-1 rounded">
                {currentDay}/100
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="font-semibold mr-2">Streak:</span>
              <span className="text-lg font-bold bg-amber-500 text-white dark:bg-amber-600 px-2 py-1 rounded">
                {streak} days
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <UserProfile onClose={() => setShowProfileModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;