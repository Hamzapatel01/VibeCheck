import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatTimestamp } from '../../utils/moodUtils';

const MoodHistory = ({ history, onDelete }) => {
  if (!history || history.length === 0) {
    return <p>No mood history available.</p>;
  }

  return (
    <section className="mood-history">
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Mood</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{formatTimestamp(entry.timestamp)}</td>
              <td>
                <span className={`mood-tag ${entry.mood.toLowerCase()}`}>
                  {entry.mood}
                </span>
              </td>
              <td>{entry.notes || "No notes provided"}</td>
              <td className="action-cell">
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(entry.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default MoodHistory; 