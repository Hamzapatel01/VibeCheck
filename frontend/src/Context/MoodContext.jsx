import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create the context
const MoodContext = createContext(null);

// Provider component
export const MoodProvider = ({ children }) => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userData } = useAuth();

  // Fetch mood history
  const fetchMoodHistory = useCallback(async () => {
    if (!userData?.username) {
      setError('User not logged in');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/moods-history', {
        params: { username: userData.username }
      });
      setMoodHistory(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch mood history');
      console.error('Error fetching mood history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  // Log new mood
  const logMood = useCallback(async (moodData) => {
    if (!userData?.username) {
      setError('User not logged in');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/log-mood', {
        ...moodData,
        username: userData.username
      });
      setMoodHistory(prev => [...prev, response.data.mood]);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to log mood');
      console.error('Error logging mood:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  const value = {
    moodHistory,
    isLoading,
    error,
    fetchMoodHistory,
    logMood,
    setMoodHistory
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};

// Export the hook
export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

// Export the context if needed elsewhere
export default MoodContext;
