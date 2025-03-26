import React from 'react';

const UndoAlert = ({ type, isVisible, onUndo, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className={`undo-alert ${type === 'single' ? 'single-delete' : ''}`}>
      <div className="undo-alert-content">
        <span>{type === 'single' ? 'Mood entry deleted' : 'All moods have been cleared'}</span>
        <div className="undo-alert-actions">
          <button className="undo-btn" onClick={onUndo}>
            Undo
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UndoAlert; 