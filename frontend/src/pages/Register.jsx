import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../styles.css";
import loginImage from "../assets/relaxation.jpg";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    date_of_birth: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth
      });

      if (response.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.error || "Registration failed");
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration error:", err);
    }
  };

  return (
    <section className="login-container">
      <div className="login-modal">
        <div className="login-form">
          <div className="login-content">
            <h1 className="title">Create Account</h1>
            <h3 className="subtitle">Join Menti Track today</h3>

            {error && <div className="error-message">{error}</div>}
            
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="recovery">
                <div className="remember">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the Terms and Conditions
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Create Account
              </button>

              <button type="button" className="btn btn-secondary">
                <img src="/google-logo.png" alt="Google" />
                Sign up with Google
              </button>
            </form>

            <div className="login-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>

        <div className="login-image">
          <img
            src={loginImage}
            alt="Registration Illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default Register;
