import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { Task, Category } from '../types';

// Default categories for new users
const defaultCategories: Category[] = [
  { id: '1', name: 'DSA', color: 'bg-blue-500' },
  { id: '2', name: 'Aptitude', color: 'bg-green-500' },
  { id: '3', name: 'CS Fundamentals', color: 'bg-purple-500' },
  { id: '4', name: 'Resume', color: 'bg-yellow-500' },
  { id: '5', name: 'Projects', color: 'bg-pink-500' },
  { id: '6', name: 'Mock Interviews', color: 'bg-red-500' },
];

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  currentDay: number;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  getTasksByDay: (day: number) => Task[];
  resetProgress: () => Promise<void>;
  incrementDay: () => Promise<void>;
  decrementDay: () => Promise<void>;
  setCurrentDay: (day: number) => Promise<void>;
  streak: number;
  completionRate: number;
  notificationSettings: {
    emailNotifications: boolean;
    dailyReminders: boolean;
  };
  updateNotificationSettings: (settings: {
    emailNotifications: boolean;
    dailyReminders: boolean;
  }) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [currentDay, setCurrentDayState] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    dailyReminders: true,
  });

  // Fetch user's data when authenticated
  useEffect(() => {
    if (user) {
      if (isDemoMode) {
        // Initialize demo data
        setCategories(defaultCategories);
        setTasks([]);
        setCurrentDayState(1);
        setStreak(0);
      } else {
        fetchUserData();
      }
    } else {
      // Reset state when user logs out
      setTasks([]);
      setCategories(defaultCategories);
      setCurrentDayState(1);
      setStreak(0);
    }
  }, [user, isDemoMode]);

  // Add notification settings fetch
  useEffect(() => {
    if (user && !isDemoMode) {
      fetchNotificationSettings();
    }
  }, [user, isDemoMode]);

  const fetchNotificationSettings = async () => {
    if (!user || isDemoMode) return;

    const { data } = await supabase
      .from('user_settings')
      .select('email_notifications, daily_reminders')
      .eq('user_id', user.id);

    // If settings exist, use them. Otherwise, create default settings
    if (data && data.length > 0) {
      setNotificationSettings({
        emailNotifications: data[0].email_notifications,
        dailyReminders: data[0].daily_reminders,
      });
    } else {
      // Create default settings if none exist using upsert
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: user.id,
            email_notifications: true,
            daily_reminders: true,
          },
          { onConflict: 'user_id' }
        );

      if (!error) {
        setNotificationSettings({
          emailNotifications: true,
          dailyReminders: true,
        });
      }
    }
  };

  const fetchUserData = async () => {
    if (!user || isDemoMode) return;

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (categoriesData) {
      setCategories(categoriesData);
    }

    // If no categories exist, create default ones
    if (!categoriesData?.length) {
      for (const category of defaultCategories) {
        await supabase
          .from('categories')
          .insert({ ...category, user_id: user.id });
      }
      
      // Fetch categories again after creating defaults
      const { data: newCategories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (newCategories) {
        setCategories(newCategories);
      }
    }

    // Fetch tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (tasksData) {
      setTasks(tasksData);
    }

    // Fetch progress
    const { data: progressData } = await supabase
      .from('progress')
      .select('*')
      .single();

    if (progressData) {
      setCurrentDayState(progressData.current_day);
      setStreak(progressData.streak);
    } else {
      // Create initial progress record if it doesn't exist
      await supabase
        .from('progress')
        .insert({ user_id: user.id });
    }
  };

  const updateNotificationSettings = async (settings: {
    emailNotifications: boolean;
    dailyReminders: boolean;
  }) => {
    if (!user || isDemoMode) {
      setNotificationSettings(settings);
      return;
    }

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        email_notifications: settings.emailNotifications,
        daily_reminders: settings.dailyReminders,
      });

    if (!error) {
      setNotificationSettings(settings);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) return;

    const newTask = {
      ...task,
      id: isDemoMode ? `demo-task-${Date.now()}` : '',
    };

    if (isDemoMode) {
      setTasks([...tasks, newTask as Task]);
      if (task.completed) {
        setStreak(streak + 1);
      }
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setTasks([...tasks, data]);
      if (task.completed) {
        await updateStreak(true);
      }
    }
  };

  const updateTask = async (updatedTask: Task) => {
    if (!user) return;

    if (isDemoMode) {
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', updatedTask.id);

    if (error) throw error;
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    if (isDemoMode) {
      setTasks(tasks.filter(task => task.id !== id));
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = async (id: string) => {
    if (!user) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    await updateTask(updatedTask);

    if (task.day === currentDay) {
      const dayTasks = tasks.filter(t => t.day === currentDay);
      const allCompleted = dayTasks.every(t => 
        t.id === id ? !task.completed : t.completed
      );
      
      if (allCompleted && dayTasks.length > 0) {
        if (isDemoMode) {
          setStreak(streak + 1);
        } else {
          await updateStreak(true);
        }
      }
    }
  };

  const updateStreak = async (completed: boolean) => {
    if (!user || isDemoMode) {
      const newStreak = completed ? streak + 1 : 0;
      setStreak(newStreak);
      return;
    }

    const newStreak = completed ? streak + 1 : 0;
    const { error } = await supabase
      .from('progress')
      .update({ 
        streak: newStreak,
        last_completed: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw error;
    setStreak(newStreak);
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;

    const newCategory = {
      ...category,
      id: isDemoMode ? `demo-category-${Date.now()}` : '',
    };

    if (isDemoMode) {
      setCategories([...categories, newCategory as Category]);
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setCategories([...categories, data]);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;

    if (isDemoMode) {
      setCategories(categories.filter(category => category.id !== id));
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setCategories(categories.filter(category => category.id !== id));
  };

  const updateCategory = async (updatedCategory: Category) => {
    if (!user) return;

    if (isDemoMode) {
      setCategories(categories.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      ));
      return;
    }

    const { error } = await supabase
      .from('categories')
      .update(updatedCategory)
      .eq('id', updatedCategory.id);

    if (error) throw error;
    setCategories(categories.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ));
  };

  const getTasksByDay = (day: number) => {
    return tasks.filter(task => task.day === day);
  };

  const resetProgress = async () => {
    if (!user || !window.confirm('Are you sure you want to reset your progress? This will delete all tasks and reset your day count.')) {
      return;
    }

    if (isDemoMode) {
      setTasks([]);
      setCurrentDayState(1);
      setStreak(0);
      return;
    }

    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', user.id);

    if (tasksError) throw tasksError;

    const { error: progressError } = await supabase
      .from('progress')
      .update({ 
        current_day: 1,
        streak: 0,
        last_completed: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (progressError) throw progressError;

    setTasks([]);
    setCurrentDayState(1);
    setStreak(0);
  };

  const setCurrentDay = async (day: number) => {
    if (!user) return;

    if (isDemoMode) {
      setCurrentDayState(day);
      return;
    }

    const { error } = await supabase
      .from('progress')
      .update({ current_day: day })
      .eq('user_id', user.id);

    if (error) throw error;
    setCurrentDayState(day);
  };

  const incrementDay = async () => {
    if (!user) return;

    const todayTasks = getTasksByDay(currentDay);
    const allCompleted = todayTasks.length > 0 && todayTasks.every(task => task.completed);

    if (!allCompleted && todayTasks.length > 0) {
      if (!window.confirm('Not all tasks for today are completed. Are you sure you want to move to the next day?')) {
        return;
      }
      if (isDemoMode) {
        setStreak(0);
      } else {
        await updateStreak(false);
      }
    } else if (todayTasks.length > 0) {
      if (isDemoMode) {
        setStreak(streak + 1);
      } else {
        await updateStreak(true);
      }
    }

    await setCurrentDay(currentDay + 1);
  };

  const decrementDay = async () => {
    if (currentDay > 1) {
      await setCurrentDay(currentDay - 1);
    }
  };

  // Calculate completion rate
  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) 
    : 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        currentDay,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        addCategory,
        deleteCategory,
        updateCategory,
        getTasksByDay,
        resetProgress,
        incrementDay,
        decrementDay,
        setCurrentDay,
        streak,
        completionRate,
        notificationSettings,
        updateNotificationSettings,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};