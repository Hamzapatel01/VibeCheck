import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>Vibe Check</h1>
      </div>
      <div className="nav-links">
        <Link 
          to="/home" 
          className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/report" 
          className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}
        >
          Report
        </Link>
        <Link 
          to="/chat" 
          className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
        >
          Chat
        </Link>
        <Link 
          to="/contact" 
          className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
        >
          Useful Links
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
