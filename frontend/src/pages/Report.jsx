import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import DeleteConfirmModal from '../components/Report/DeleteConfirmModal';
import UndoAlert from '../components/Report/UndoAlert';
import ReportHeader from '../components/Report/ReportHeader';
import MoodInsights from '../components/Report/MoodInsights';
import AdditionalInsights from '../components/Report/AdditionalInsights';
import MoodChart from '../components/Report/MoodChart';
import MoodHistory from '../components/Report/MoodHistory';
import useMoodHistory from '../hooks/useMoodHistory';
import { getMoodInsights, formatTimestamp } from '../utils/moodUtils';
import { getChartData, chartOptions } from '../utils/chartConfig';
import { useMood } from '../Context/MoodContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Report = () => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMoodId, setDeleteMoodId] = useState(null);
  const [showUndoAlert, setShowUndoAlert] = useState(false);
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
      <UndoAlert 
        type="all"
        isVisible={showUndoAlert}
        onUndo={actions.fetchMoodHistory}
        onClose={() => setShowUndoAlert(false)}
      />

      <ReportHeader 
        onDownload={() => {/* implement download logic */}} 
        onClear={() => setShowDeleteConfirm(true)} 
      />

      <MoodInsights insights={insights} />
      <AdditionalInsights insights={insights} />
      <MoodChart data={chartData} options={chartOptions} />
      <MoodHistory 
        history={moodHistory} 
        onDelete={(id) => {
          setDeleteMoodId(id);
          setShowDeleteConfirm(true);
        }}
      />

      <DeleteConfirmModal 
        isOpen={showDeleteConfirm}
        moodId={deleteMoodId}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteMoodId(null);
        }}
        onConfirm={async () => {
          if (deleteMoodId) {
            await actions.deleteMood(deleteMoodId);
            await fetchMoodHistory();
          } else {
            const success = await actions.clearHistory();
            if (success) {
              setShowUndoAlert(true);
            }
          }
          setShowDeleteConfirm(false);
          setDeleteMoodId(null);
        }}
      />
    </div>
  );
};

export default Report;
