import { useState, useEffect } from 'react';
import axios from 'axios';

const useMoodHistory = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletedMoods, setDeletedMoods] = useState([]);
  const [deletedMood, setDeletedMood] = useState(null);

  const fetchMoodHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/moods-history", {
        headers: { Authorization: `Bearer ${token}` }
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
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:5000/delete_mood/${moodId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const deletedEntry = moodHistory.find(entry => entry._id === moodId);
      setDeletedMood(deletedEntry);
      setMoodHistory(prevHistory => prevHistory.filter(entry => entry._id !== moodId));
      
      return true;
    } catch (error) {
      console.error("Error deleting mood:", error);
      return false;
    }
  };

  const clearHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://127.0.0.1:5000/clear_history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeletedMoods(moodHistory);
      setMoodHistory([]);
      return true;
    } catch (error) {
      console.error("Error clearing history:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

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