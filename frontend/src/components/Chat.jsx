import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faVideo, faPhone, faEllipsisV,
  faPaperclip, faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Add introduction message when component mounts
  useEffect(() => {
    const introMessage = {
      text: `Hello! I'm Dr. Sarah Johnson, your AI mental health companion. I'm here to listen, support, and guide you through your mental health journey. 

I understand that talking about mental health can be challenging, but I want you to know that this is a safe, confidential space. How are you feeling today?`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([introMessage]);
  }, []);

  const chatContact = {
    id: 'dr-sarah',
    name: 'Dr. Sarah Johnson',
    icon: faUserMd,
    lastMessage: 'Thank you for sharing that...',
    status: 'online'
  };

  const sendMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { 
      text: userMessage, 
      isBot: false,
      timestamp 
    }]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/chatbot", { message: userMessage });
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: res.data.response, 
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
        isBot: true,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      console.error("Error:", err);
    }
  };

  return (
    <main className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2>Conversations</h2>
        </div>
        <div className="chat-list">
          <div className="chat-item active">
            <div className="chat-avatar">
              <FontAwesomeIcon icon={chatContact.icon} />
            </div>
            <div className="chat-info">
              <h4>{chatContact.name}</h4>
              <p>{chatContact.lastMessage}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-contact">
            <div className="chat-avatar">
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            <div className="chat-info">
              <h3>{chatContact.name}</h3>
              <span className="status online">Online</span>
            </div>
          </div>
          <div className="chat-actions">
            <button className="action-btn">
              <FontAwesomeIcon icon={faVideo} />
            </button>
            <button className="action-btn">
              <FontAwesomeIcon icon={faPhone} />
            </button>
            <button className="action-btn">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.isBot ? 'received' : 'sent'}`}
            >
              <div className="message-content">
                <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                <span className="message-time">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message received">
              <div className="message-content">
                <p>Dr. Sarah is typing...</p>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <button className="input-btn">
            <FontAwesomeIcon icon={faPaperclip} />
          </button>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            className="input-btn send"
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Chatbot;