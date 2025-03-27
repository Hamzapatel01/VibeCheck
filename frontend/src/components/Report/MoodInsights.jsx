import React from 'react';

const MoodInsights = ({ insights, history }) => {
  // Default values if insights is undefined
  const defaultInsights = {
    mostCommonMood: 'N/A'
  };

  // Merge provided insights with defaults
  const safeInsights = { ...defaultInsights, ...insights };

  // Calculate mood counts
  const moodCounts = history?.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="mood-insights">
      <h2>Mood Insights</h2>
      <div className="insights-grid">
        <div className="insight-card">
          <h3>Most Common Mood</h3>
          <p>{safeInsights.mostCommonMood}</p>
        </div>
        <div className="insight-card">
          <h3>Happy Days</h3>
          <p className="mood-count happy">{moodCounts['Happy'] || 0}</p>
        </div>
        <div className="insight-card">
          <h3>Neutral Days</h3>
          <p className="mood-count neutral">{moodCounts['Neutral'] || 0}</p>
        </div>
        <div className="insight-card">
          <h3>Sad Days</h3>
          <p className="mood-count sad">{moodCounts['Sad'] || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default MoodInsights; 