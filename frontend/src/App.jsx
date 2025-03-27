import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import { MoodProvider } from "./context/MoodContext";
import Navbar from "./pages/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Chat from "./components/Chat";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <Router>
    <AuthProvider>
      <MoodProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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

export default App;
