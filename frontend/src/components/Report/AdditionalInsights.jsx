import React from 'react';

const AdditionalInsights = ({ insights }) => {
  // Default values if insights is undefined
  const defaultInsights = {
    streak: 0,
    bestTime: 'N/A',
    totalEntries: 0
  };

  // Merge provided insights with defaults
  const safeInsights = { ...defaultInsights, ...insights };

  // Ensure numbers are valid
  const streak = isNaN(safeInsights.streak) ? 0 : safeInsights.streak;
  const totalEntries = isNaN(safeInsights.totalEntries) ? 0 : safeInsights.totalEntries;
  const bestTime = safeInsights.bestTime || 'N/A';

  return (
    <section className="additional-insights">
      <div className="additional-grid">
        <div className="additional-item">
          <div className="additional-label">Longest Streak</div>
          <div className="additional-value">{streak} days</div>
        </div>
        <div className="additional-item">
          <div className="additional-label">Best Time</div>
          <div className="additional-value">{bestTime}</div>
        </div>
        <div className="additional-item">
          <div className="additional-label">Total Entries</div>
          <div className="additional-value">{totalEntries}</div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalInsights; 