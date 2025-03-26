import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="home-container">
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="text-gradient">Welcome to Menti Track</span><br />
              Your Mental Health Companion
            </h1>
            <p className="hero-subtitle">
              Track, Monitor, and Improve Your Mental Well-being<br />
              With Our Comprehensive Tools
            </p>
          </div>
          <div className="scroll-indicator">
            <span>WELCOME</span>
            <div className="scroll-arrow"></div>
          </div>
        </section>
      </main>

      <button className="logout-button" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} />
        Logout
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="login-modal">
          <div className="modal-content">
            <div className="login-left">
              <h2>Welcome Back</h2>
              <p className="subtitle">Please enter your details.</p>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </div>
                <button type="submit" className="btn btn-submit">
                  Sign in
                </button>
                <button type="button" className="btn btn-google">
                  <img src={googleLogo} alt="Google" />
                  Sign in with Google
                </button>
                <p className="register-link">
                  Don't have an account? <Link to="/signup">Sign up for free!</Link>
                </p>
              </form>
            </div>
            <div className="login-right">
              <div className="right-content">
                <h3>WHO WE ARE</h3>
                <h2>Your Mental Health Journey<br />Starts Here</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;