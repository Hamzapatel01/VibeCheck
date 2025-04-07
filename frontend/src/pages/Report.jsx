import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import useMoodHistory from '../hooks/useMoodHistory';
import { getMoodInsights, formatTimestamp } from '../utils/moodUtils';
import { getChartData, chartOptions } from '../utils/chartConfig';
import { useMood } from '../context/MoodContext';
import MoodInsights from '../components/Report/MoodInsights';
import MoodChart from '../components/Report/MoodChart';
import MoodHistory from '../components/Report/MoodHistory';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Report = () => {
  const navigate = useNavigate();
  const { moodHistory, fetchMoodHistory } = useMood();

  const {
    isLoading,
    error,
    actions
  } = useMoodHistory();

  const insights = getMoodInsights(moodHistory);
  const chartData = getChartData(moodHistory, formatTimestamp);

  useEffect(() => {
    fetchMoodHistory();
  }, [fetchMoodHistory]);

  if (isLoading) {
    return <div className="report-container loading-state">
      <h2>Loading your mood history...</h2>
    </div>;
  }

  if (error) {
    return <div className="report-container error-state">
      <h2>Error</h2>
      <p>{error}</p>
      <button className="action-btn primary-btn" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>;
  }

  if (moodHistory.length === 0) {
    return <div className="report-container">
      <div className="report-card empty-state">
        <h2>No Mood History Available</h2>
        <p>Start tracking your moods to see your reports!</p>
        <button className="action-btn primary-btn" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </div>
    </div>;
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Your Mood Report</h1>
        <div className="report-actions">
          <button className="report-btn download-report" onClick={() => {/* implement download logic */}}>
            Download Report
          </button>
          <button className="report-btn clear-history" onClick={() => {/* implement clear history logic */}}>
            Clear History
          </button>
        </div>
      </div>

      <div className="report-content">
        <MoodInsights insights={insights} history={moodHistory} />
        <MoodChart data={chartData} options={chartOptions} />
        <MoodHistory 
          history={moodHistory} 
          onDelete={async (id) => {
            await actions.deleteMood(id);
            await fetchMoodHistory();
          }}
        />
      </div>
    </div>
  );
};

export default Report;
