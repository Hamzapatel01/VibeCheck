// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LogMood = ({ onMoodLogged }) => {
//   const [mood, setMood] = useState("");
//   const [note, setNote] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://127.0.0.1:5000/log-mood", { mood, note });
//       alert("Mood logged successfully!");
//       setMood("");
//       setNote("");
//       onMoodLogged(); // Notify the Dashboard to refresh mood history
      
//       // Navigate to dashboard with a flag to show chatbot
//       navigate('/dashboard', { state: { showChatbot: true } });
//     } catch (err) {
//       console.error("Error logging mood:", err);
//       alert("Failed to log mood. Please try again.");
//     }
//   };

//   return (
//     <div className="log-mood-container">
//       <h2>How are you feeling today?</h2>
//       <form onSubmit={handleSubmit} className="mood-form">
//         <div className="mood-selector">
//           <label>Mood:</label>
//           <select value={mood} onChange={(e) => setMood(e.target.value)} required>
//             <option value="">Select Mood</option>
//             <option value="10">Very Happy 😄</option>
//             <option value="9">Happy 😊</option>
//             <option value="8">Pretty Good 🙂</option>
//             <option value="7">Good 👍</option>
//             <option value="6">Okay 😐</option>
//             <option value="5">Meh 😐</option>
//             <option value="4">Not Great 😕</option>
//             <option value="3">Sad 😢</option>
//             <option value="2">Very Sad 😭</option>
//             <option value="1">Terrible 😫</option>
//           </select>
//         </div>
//         <div className="note-input">
//           <label>Note (optional):</label>
//           <textarea 
//             value={note} 
//             onChange={(e) => setNote(e.target.value)}
//             placeholder="What's on your mind?"
//           />
//         </div>
//         <button type="submit" className="submit-btn">Log Mood</button>
//       </form>
//     </div>
//   );
// };

// export default LogMood;
