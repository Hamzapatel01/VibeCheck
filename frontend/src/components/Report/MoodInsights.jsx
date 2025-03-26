import React from 'react';

const MoodInsights = ({ insights }) => {
  return (
    <section className="mood-insights">
      <div className="insights-grid">
        <div className="insight-item">
          <span className="insight-label">Dominant Mood</span>
          <span className="insight-value">{insights.dominantMood}</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Happy Days</span>
          <span className="insight-value">{insights.happyPercentage}%</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Neutral Days</span>
          <span className="insight-value">{insights.neutralPercentage}%</span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Sad Days</span>
          <span className="insight-value">{insights.sadPercentage}%</span>
        </div>
      </div>
    </section>
  );
};

export default MoodInsights; 