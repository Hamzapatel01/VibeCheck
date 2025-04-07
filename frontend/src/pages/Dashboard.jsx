import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMood } from '../context/MoodContext';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWalking, faBook, faMusic, faChartLine, faRobot, faHeart 
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { moodHistory, isLoading, error, fetchMoodHistory } = useMood();
  const { userData } = useAuth();
  const [moodInput, setMoodInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [showContent, setShowContent] = useState(null);
  const [showTherapistPrompt, setShowTherapistPrompt] = useState(false);

  useEffect(() => {
    fetchMoodHistory();
  }, [fetchMoodHistory]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleMoodLog = async (e) => {
    e.preventDefault();
    if (!moodInput) {
      alert('Please select a mood');
      return;
    }

    try {
      const formattedTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      
      const response = await axios.post("http://127.0.0.1:5000/log-mood", {
        mood: moodInput,
        note: noteInput,
        timestamp: formattedTimestamp,
        username: userData.username
      });

      if (response.status === 201) {
        alert('Mood logged successfully!');
        setMoodInput("");
        setNoteInput("");
        fetchMoodHistory();
        
        // Handle different moods
        switch(moodInput) {
          case 'Happy':
            setShowContent('song');
            break;
          case 'Neutral':
            setShowContent('animals');
            break;
          case 'Sad':
            setShowContent('meditation');
            break;
        }
      }
    } catch (error) {
      console.error("Error logging mood:", error);
      alert('Failed to log mood. Please try again.');
    }
  };

  const handleActivityStart = (activity) => {
    alert(`Starting activity: ${activity}`);
  };

  const handleTherapistChoice = (choice) => {
    if (choice === 'yes') {
      navigate('/chat');
    } else {
      setShowTherapistPrompt(false);
    }
  };

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Mental Health Dashboard</h1>
        <p>Track your mood and get personalized recommendations</p>
      </div>

      <div className="mood-input-section">
        <h2>How are you feeling today?</h2>
        <form className="mood-input-form" onSubmit={handleMoodLog}>
          <div className="mood-select">
            <label htmlFor="mood">Mood:</label>
            <select 
              id="mood" 
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
            >
              <option value="">Select Mood</option>
              <option value="Happy">Happy 😊</option>
              <option value="Neutral">Neutral 😐</option>
              <option value="Sad">Sad 😢</option>
            </select>
          </div>
          <div className="note-input">
            <label htmlFor="note">Note (optional):</label>
            <textarea 
              id="note" 
              rows="3"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="What's on your mind?"
            ></textarea>
          </div>
          <button type="submit" className="log-mood-btn">Log Mood</button>
        </form>
      </div>

      {showContent === 'song' && (
        <div className="mood-content">
          <h3>Here's a song to match your happy mood!</h3>
          <div className="song-player">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Happy Song"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {showContent === 'animals' && (
        <div className="mood-content">
          <h3>Here are some cute animals to brighten your day!</h3>
          <div className="animal-grid">
            <img 
              src="https://source.unsplash.com/400x400/?kitten" 
              alt="Cute cat"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg";
              }}
            />
            <img 
              src="https://source.unsplash.com/400x400/?puppy" 
              alt="Cute dog"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg";
              }}
            />
            <img 
              src="https://www.rd.com/wp-content/uploads/2020/04/GettyImages-694542042-e1586274805503-scaled.jpg?fit=700,700" 
              alt="Cute bunny"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://www.rd.com/wp-content/uploads/2020/04/GettyImages-694542042-e1586274805503-scaled.jpg?fit=700,700";
              }}
            />
          </div>
        </div>
      )}

      {showContent === 'meditation' && (
        <div className="mood-content meditation-content">
          <h3>Take a moment to breathe and relax</h3>
          <div className="meditation-player">
            <iframe 
              width="560" 
              height="315" 
              src="https://www.youtube.com/embed/tybOi4hjZFQ" 
              title="Guided Meditation"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="meditation-guide">
            <h4>Quick Meditation Guide</h4>
            <ol>
              <li>Find a quiet, comfortable place</li>
              <li>Sit or lie down in a relaxed position</li>
              <li>Close your eyes and take deep breaths</li>
              <li>Focus on your breath, letting thoughts come and go</li>
              <li>Stay present in the moment</li>
            </ol>
          </div>
          <button 
            className="therapist-btn"
            onClick={() => setShowTherapistPrompt(true)}
          >
            <FontAwesomeIcon icon={faHeart} />
            Would you like to talk to our AI therapist?
          </button>
        </div>
      )}

      {showTherapistPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Talk to Our AI Therapist</h3>
            <p>Our AI therapist is here to listen and help. Would you like to start a conversation?</p>
            <div className="modal-actions">
              <button 
                className="action-btn cancel-btn"
                onClick={() => handleTherapistChoice('no')}
              >
                Not Now
              </button>
              <button 
                className="action-btn confirm-btn"
                onClick={() => handleTherapistChoice('yes')}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Activity Suggestions Card */}
        <div className="dashboard-card suggestions-card expanded">
          <h3>Suggested Activities</h3>
          <div className="suggestions-content">
            {[
              { icon: faWalking, title: "10-minute Walk", desc: "Perfect weather for a quick stroll!" },
              { icon: faBook, title: "Reading Break", desc: "Take a 15-minute reading break" },
              { icon: faMusic, title: "Music Therapy", desc: "Listen to your calm playlist" }
            ].map((activity, index) => (
              <div key={index} className="suggestion-item">
                <FontAwesomeIcon icon={activity.icon} />
                <div className="suggestion-text">
                  <h4>{activity.title}</h4>
                  <p>{activity.desc}</p>
                </div>
                <button 
                  className="do-now-btn"
                  onClick={() => handleActivityStart(activity.title)}
                >
                  Do Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card expanded">
          <h3>Quick Actions</h3>
          <div className="actions-content">
            <button className="action-btn view-report" onClick={() => navigate('/report')}>
              <FontAwesomeIcon icon={faChartLine} />
              View Detailed Report
            </button>
            <button className="action-btn talk-ai" onClick={() => navigate('/chat')}>
              <FontAwesomeIcon icon={faRobot} />
              Talk to AI Assistant
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;