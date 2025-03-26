import React from 'react';

const ReportHeader = ({ onDownload, onClear }) => {
  return (
    <div className="report-header">
      <h1>Your Mood Report</h1>
      <div className="report-actions">
        <button className="report-btn download-report" onClick={onDownload}>
          Download Report
        </button>
        <button className="report-btn clear-history" onClick={onClear}>
          Clear History
        </button>
      </div>
    </div>
  );
};

export default ReportHeader; 