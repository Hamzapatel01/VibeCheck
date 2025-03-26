import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import LogMood from "./pages/LogMood";
import Navbar from "./pages/Navbar";
import "./styles.css";
import "./index.css";
import { MoodProvider } from "./context/MoodContext";
import Chat from "./components/Chat";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import { AuthProvider } from './context/AuthContext';
import ContactUs from "./pages/ContactUs";

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const isUserLoggedIn = localStorage.getItem("isAuthenticated") === "true";
  if (isUserLoggedIn) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }
  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MoodProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/report"
              element={
                <PrivateRoute>
                  <Report />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <ContactUs />
                </PrivateRoute>
              }
            />
          </Routes>
        </MoodProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
