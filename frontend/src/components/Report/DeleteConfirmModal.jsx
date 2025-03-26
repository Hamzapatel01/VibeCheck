import React from 'react';

const DeleteConfirmModal = ({ isOpen, moodId, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{moodId ? "Delete Mood Entry" : "Clear History"}</h3>
        <p>
          {moodId 
            ? "Are you sure you want to delete this mood entry? This action cannot be undone."
            : "Are you sure you want to clear all your mood history? This action cannot be undone."}
        </p>
        <div className="modal-actions">
          <button className="action-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="action-btn confirm-btn" onClick={onConfirm}>
            {moodId ? "Delete Entry" : "Clear History"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 