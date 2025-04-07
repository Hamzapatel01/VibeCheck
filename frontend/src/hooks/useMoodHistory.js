import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useMoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletedMoods, setDeletedMoods] = useState([]);
  const [deletedMood, setDeletedMood] = useState(null);
  const { userData } = useAuth();

  const fetchMoodHistory = async () => {
    if (!userData?.username) {
      setError('User not logged in');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get("http://127.0.0.1:5000/moods-history", {
        params: { username: userData.username }
      });
      setMoodHistory(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching mood history:", error);
      setError("Failed to load mood history. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMood = async (moodId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_mood/${moodId}`);
      setMoodHistory(prevHistory => prevHistory.filter(entry => entry.id !== moodId));
      return true;
    } catch (error) {
      console.error("Error deleting mood:", error);
      return false;
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete("http://127.0.0.1:5000/clear_history");
      setMoodHistory([]);
      return true;
    } catch (error) {
      console.error("Error clearing history:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, [userData]);

  return {
    moodHistory,
    isLoading,
    error,
    deletedMoods,
    deletedMood,
    actions: {
      fetchMoodHistory,
      deleteMood,
      clearHistory,
      setMoodHistory,
      setDeletedMoods,
      setDeletedMood
    }
  };
};

export default useMoodHistory;