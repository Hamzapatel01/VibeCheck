import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import "../styles.css";
import loginImage from "../assets/relaxation.jpg"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    document.body.classList.add("login-page");
    if (isAuthenticated) {
      navigate('/home');
    }

    return () => document.body.classList.remove("login-page");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password,
      });

      if (response.status === 200) {
        login();
        navigate("/home");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <section className="login-container">
      <div className="login-modal">
        <div className="login-form">
          <div className="login-content">
            <h1 className="title">Welcome to Menti Track</h1>
            <h3 className="subtitle">Please enter your details to continue</h3>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="recovery">
                <div className="remember">
                  <input type="checkbox" id="remember-me" />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
                <a href="#" className="forgot">
                  Forgot password?
                </a>
              </div>

              <button className="btn btn-primary" type="submit">
                Sign in
              </button>
              <button className="btn btn-secondary">
                <img src="/google-logo.png" alt="Google" /> 
                Sign in with Google
              </button>
            </form>

            <div className="login-footer">
              Don't have an account? <a href="/register">Sign up for free!</a>
            </div>
          </div>
        </div>

        <div className="login-image">
          <img
            src={loginImage}
            alt="Login Illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
