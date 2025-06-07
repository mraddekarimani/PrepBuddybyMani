import React, { useState } from 'react';
import { Bell, BellOff, Save, Mail, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NotificationSettingsProps {
  onSave: (settings: { emailNotifications: boolean; dailyReminders: boolean }) => void;
  currentSettings: {
    emailNotifications: boolean;
    dailyReminders: boolean;
  };
  onClose?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  onSave, 
  currentSettings, 
  onClose 
}) => {
  const [emailNotifications, setEmailNotifications] = useState(currentSettings.emailNotifications);
  const [dailyReminders, setDailyReminders] = useState(currentSettings.dailyReminders);
  const [isSaving, setIsSaving] = useState(false);
  const { user, isDemoMode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await onSave({
        emailNotifications,
        dailyReminders,
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = 
    emailNotifications !== currentSettings.emailNotifications ||
    dailyReminders !== currentSettings.dailyReminders;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notification Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive updates about your progress, achievements, and important announcements
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
                disabled={isDemoMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Daily Reminders</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get reminded to complete your daily tasks and maintain your streak
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="sr-only peer"
                disabled={isDemoMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {isDemoMode && (
          <div className="bg-amber-100 dark:bg-amber-900 border border-amber-400 text-amber-700 dark:text-amber-200 px-4 py-3 rounded-lg text-sm">
            <Bell className="inline h-4 w-4 mr-2" />
            Demo Mode: Notification settings are not persisted but you can still test the interface
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
          <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Email: {user?.email}</p>
          <p>Notifications will be sent to this email address when enabled.</p>
        </div>

        {hasChanges && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setEmailNotifications(currentSettings.emailNotifications);
                setDailyReminders(currentSettings.dailyReminders);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NotificationSettings;