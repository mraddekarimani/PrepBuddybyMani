import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';
import { User, Mail, Bell, BellOff, Save, Edit3, Camera, Shield } from 'lucide-react';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, isDemoMode } = useAuth();
  const { notificationSettings, updateNotificationSettings } = useTaskContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
  const [bio, setBio] = useState(user?.user_metadata?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [emailNotifications, setEmailNotifications] = useState(notificationSettings.emailNotifications);
  const [dailyReminders, setDailyReminders] = useState(notificationSettings.dailyReminders);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setEmailNotifications(notificationSettings.emailNotifications);
    setDailyReminders(notificationSettings.dailyReminders);
  }, [notificationSettings]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Save notification settings
      await updateNotificationSettings({
        emailNotifications,
        dailyReminders,
      });

      // In a real app, you would also update user metadata here
      // For demo mode, we'll just show success
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Profile</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          )}
        </div>
        {isDemoMode && (
          <div className="mt-3 bg-amber-100 dark:bg-amber-900 border border-amber-400 text-amber-700 dark:text-amber-200 px-3 py-2 rounded-lg text-sm">
            <Shield className="inline h-4 w-4 mr-1" />
            Demo Mode: Profile changes are not persisted
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold border-4 border-indigo-100 dark:border-indigo-900">
                {user?.email ? getInitials(user.email) : 'U'}
              </div>
            )}
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Avatar URL"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {displayName || 'PrepBuddy User'}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          >
            <Edit3 className="h-5 w-5" />
          </button>
        </div>

        {/* Bio Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-md min-h-[80px]">
              {bio || 'No bio added yet. Click edit to add one!'}
            </p>
          )}
        </div>

        {/* Notification Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Notification Preferences
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive updates about your progress and achievements
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <BellOff className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Daily Reminders</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get reminded to complete your daily tasks
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dailyReminders}
                  onChange={(e) => setDailyReminders(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Member since:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {isDemoMode ? 'Demo User' : 'Standard User'}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Save Button */}
        {(isEditing || emailNotifications !== notificationSettings.emailNotifications || dailyReminders !== notificationSettings.dailyReminders) && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setIsEditing(false);
                setEmailNotifications(notificationSettings.emailNotifications);
                setDailyReminders(notificationSettings.dailyReminders);
                setDisplayName(user?.user_metadata?.display_name || '');
                setBio(user?.user_metadata?.bio || '');
                setAvatarUrl(user?.user_metadata?.avatar_url || '');
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;