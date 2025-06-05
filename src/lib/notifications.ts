import { supabase } from './supabase';

const NOTIFICATIONS_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notifications`;

export const sendDailyReminder = async (email: string, currentDay: number) => {
  try {
    const response = await fetch(NOTIFICATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'daily_reminder',
        email,
        currentDay,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send daily reminder');
    }

    return true;
  } catch (error) {
    console.error('Error sending daily reminder:', error);
    return false;
  }
};

export const sendProgressUpdate = async (
  email: string,
  currentDay: number,
  completionRate: number,
  streak: number
) => {
  try {
    const response = await fetch(NOTIFICATIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'progress_update',
        email,
        currentDay,
        completionRate,
        streak,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send progress update');
    }

    return true;
  } catch (error) {
    console.error('Error sending progress update:', error);
    return false;
  }
};